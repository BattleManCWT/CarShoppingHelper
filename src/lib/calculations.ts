/**
 * Cost-of-ownership calculation engine.
 *
 * Pure, dependency-free functions. Everything the dashboard shows is derived
 * here from a `CalculatorInput`, which keeps the UI dumb and the math testable.
 *
 * Cost model (Edmunds / BTS inspired):
 *   TCO = depreciation + financing(interest)
 *       + insurance + fuel/energy + maintenance + tires + repairs
 *       - incentives
 *
 * To avoid double counting, financing contributes ONLY interest. Loan principal
 * and down payment are how you fund the car; the capital actually consumed is
 * captured by depreciation (purchase basis − resale value).
 */

import type {
  CalculatorInput,
  CostKey,
  CostLine,
  FinancingSummary,
  HorizonBreakdown,
  ResultSummary,
} from "./types";

/**
 * Default cumulative depreciation as a fraction of OTD price lost by the END
 * of each year. Rough industry shape: a steep first-year drop, ~60% lost by
 * year 5. Index 0 is "year 1". Extrapolated linearly beyond the table.
 */
const DEPRECIATION_CURVE = [0.2, 0.31, 0.42, 0.52, 0.6, 0.66, 0.71];

const CATEGORY_META: Record<CostKey, { label: string; group: "fixed" | "variable" }> = {
  depreciation: { label: "Depreciation", group: "fixed" },
  financing: { label: "Financing (interest)", group: "fixed" },
  insurance: { label: "Insurance", group: "fixed" },
  energy: { label: "Fuel / Energy", group: "variable" },
  maintenance: { label: "Maintenance", group: "variable" },
  tires: { label: "Tires", group: "variable" },
  repairs: { label: "Repairs", group: "variable" },
};

/** Cumulative fraction of OTD price lost by the end of `year` (1-based). */
function curveLossFraction(year: number): number {
  if (year <= 0) return 0;
  const idx = Math.min(year, DEPRECIATION_CURVE.length) - 1;
  if (year <= DEPRECIATION_CURVE.length) return DEPRECIATION_CURVE[idx];
  // Linear extrapolation past the table using the last year-over-year slope.
  const last = DEPRECIATION_CURVE[DEPRECIATION_CURVE.length - 1];
  const prev = DEPRECIATION_CURVE[DEPRECIATION_CURVE.length - 2];
  const slope = last - prev;
  const extra = year - DEPRECIATION_CURVE.length;
  return Math.min(0.95, last + slope * extra);
}

/* -------------------------------------------------------------------------- */
/* Purchase & financing                                                        */
/* -------------------------------------------------------------------------- */

/** Out-the-door price: what you'll actually pay, taxes and fees included. */
export function outTheDoorPrice(input: CalculatorInput): number {
  return input.otdPrice;
}

/** Amount financed after cash down, trade equity, and cash incentives. */
export function loanAmount(input: CalculatorInput): number {
  const financed =
    outTheDoorPrice(input) -
    input.downPayment -
    input.tradeInValue -
    input.incentives;
  return Math.max(0, financed);
}

/** Standard fixed-rate amortized monthly payment. */
export function monthlyPayment(input: CalculatorInput): number {
  const principal = loanAmount(input);
  const n = input.loanTermMonths;
  if (principal <= 0 || n <= 0) return 0;
  const r = input.apr / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Total interest paid over the FULL loan term. */
export function totalInterestFullTerm(input: CalculatorInput): number {
  const pay = monthlyPayment(input);
  return Math.max(0, pay * input.loanTermMonths - loanAmount(input));
}

/**
 * Interest actually paid within the first `months` of the loan (capped at the
 * loan term). Walks the amortization schedule so partial-ownership is accurate.
 */
export function interestPaidWithin(input: CalculatorInput, months: number): number {
  const principal = loanAmount(input);
  const term = input.loanTermMonths;
  if (principal <= 0 || term <= 0) return 0;
  const r = input.apr / 100 / 12;
  const pay = monthlyPayment(input);
  const cap = Math.min(months, term);
  if (r === 0) return 0; // 0% APR => no interest

  let balance = principal;
  let interest = 0;
  for (let m = 0; m < cap; m++) {
    const monthInterest = balance * r;
    interest += monthInterest;
    balance = balance + monthInterest - pay;
    if (balance <= 0) break;
  }
  return interest;
}

export function financingSummary(input: CalculatorInput): FinancingSummary {
  return {
    outTheDoorPrice: outTheDoorPrice(input),
    loanAmount: loanAmount(input),
    monthlyPayment: monthlyPayment(input),
    totalInterestFullTerm: totalInterestFullTerm(input),
  };
}

/* -------------------------------------------------------------------------- */
/* Depreciation                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Depreciation (capital lost) over `years`.
 *
 * If the user supplied an `expectedResaleValue`, we honor it at their ownership
 * horizon and scale the curve's shape to match, so 3yr/5yr stay consistent with
 * their expectation. Otherwise we use the curve directly.
 */
export function depreciation(input: CalculatorInput, years: number): number {
  const basis = input.otdPrice;
  if (basis <= 0 || years <= 0) return 0;

  let scale = 1;
  if (input.expectedResaleValue > 0 && input.ownershipYears > 0) {
    const actualLoss = (basis - input.expectedResaleValue) / basis;
    const curveLoss = curveLossFraction(input.ownershipYears);
    if (curveLoss > 0) scale = actualLoss / curveLoss;
  }
  const lossFraction = Math.min(0.95, curveLossFraction(years) * scale);
  return Math.max(0, basis * lossFraction);
}

/** Estimated resale value at the end of `years`. */
export function resaleValue(input: CalculatorInput, years: number): number {
  return Math.max(0, input.otdPrice - depreciation(input, years));
}

/* -------------------------------------------------------------------------- */
/* Recurring & usage costs                                                     */
/* -------------------------------------------------------------------------- */

/** Annual fuel (gas/hybrid) or electricity (EV) cost. */
export function annualEnergyCost(input: CalculatorInput): number {
  if (input.vehicleType === "electric") {
    if (input.milesPerKwh <= 0) return 0;
    return (input.annualMiles / input.milesPerKwh) * input.electricityPricePerKwh;
  }
  if (input.mpg <= 0) return 0;
  return (input.annualMiles / input.mpg) * input.fuelPricePerGallon;
}

/** Tire cost allocated by mileage: (cost / life) × annual miles. */
export function annualTireCost(input: CalculatorInput): number {
  if (input.tireLifeMiles <= 0) return 0;
  return (input.tireReplacementCost / input.tireLifeMiles) * input.annualMiles;
}

/* -------------------------------------------------------------------------- */
/* Horizon breakdown                                                           */
/* -------------------------------------------------------------------------- */

function makeLine(key: CostKey, amount: number): CostLine {
  return {
    key,
    label: CATEGORY_META[key].label,
    group: CATEGORY_META[key].group,
    amount: Math.max(0, amount),
  };
}

/** Full cost breakdown for a single ownership horizon (in years). */
export function breakdownForHorizon(
  input: CalculatorInput,
  years: number,
): HorizonBreakdown {
  const months = years * 12;

  const lines: CostLine[] = [
    makeLine("depreciation", depreciation(input, years)),
    makeLine("financing", interestPaidWithin(input, months)),
    makeLine("insurance", input.annualInsurance * years),
    makeLine("energy", annualEnergyCost(input) * years),
    makeLine("maintenance", input.annualMaintenance * years),
    makeLine("tires", annualTireCost(input) * years),
    makeLine("repairs", input.annualRepairReserve * years),
  ];

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const incentives = Math.max(0, input.incentives);
  const total = Math.max(0, subtotal - incentives);

  const fixedTotal = lines
    .filter((l) => l.group === "fixed")
    .reduce((s, l) => s + l.amount, 0);
  const variableTotal = lines
    .filter((l) => l.group === "variable")
    .reduce((s, l) => s + l.amount, 0);

  const totalMiles = input.annualMiles * years;
  const largestDriver = lines.reduce((a, b) => (b.amount > a.amount ? b : a), lines[0]);

  return {
    years,
    lines,
    fixedTotal,
    variableTotal,
    subtotal,
    incentives,
    total,
    monthlyAllIn: months > 0 ? total / months : 0,
    costPerMile: totalMiles > 0 ? total / totalMiles : 0,
    largestDriver,
  };
}

/* -------------------------------------------------------------------------- */
/* Top-level summary                                                           */
/* -------------------------------------------------------------------------- */

/** Build the complete result summary the dashboard renders. */
export function calculateOwnership(input: CalculatorInput): ResultSummary {
  // Always provide 3yr + 5yr, plus the user's own horizon if different.
  const horizonYears = Array.from(
    new Set([3, 5, Math.round(input.ownershipYears)].filter((y) => y > 0)),
  ).sort((a, b) => a - b);

  const horizons: Record<number, HorizonBreakdown> = {};
  for (const y of horizonYears) horizons[y] = breakdownForHorizon(input, y);

  const maxYear = Math.max(...horizonYears);
  const cumulativeByYear = Array.from({ length: maxYear }, (_, i) => {
    const year = i + 1;
    return { year, total: breakdownForHorizon(input, year).total };
  });

  return {
    input,
    financing: financingSummary(input),
    horizons,
    horizonYears,
    cumulativeByYear,
  };
}
