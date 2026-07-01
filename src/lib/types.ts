/**
 * Core domain types for the Total Cost of Ownership (TCO) calculator.
 *
 * The model is intentionally split into small, focused input groups that mirror
 * the form sections. Results are derived purely from these inputs by the
 * calculation engine in `calculations.ts` — there is no hidden state.
 */

export type VehicleType = "gas" | "hybrid" | "electric";

/** Identity + price basis for the vehicle. */
export interface VehicleInput {
  name: string;
  vehicleType: VehicleType;
  /** Out-the-door price — what you'll actually pay, taxes and fees included. */
  otdPrice: number;
}

/** How the purchase is financed. Used for cash-flow and interest cost. */
export interface FinancingInput {
  downPayment: number;
  tradeInValue: number;
  /** Annual percentage rate, e.g. 6.5 for 6.5%. */
  apr: number;
  loanTermMonths: number;
}

/** Ongoing ownership + usage assumptions. */
export interface OwnershipInput {
  /** The user's primary planning horizon in years (results headline). */
  ownershipYears: number;
  annualMiles: number;

  // --- Energy: gas/hybrid path ---
  /** Miles per gallon (used for gas & hybrid). */
  mpg: number;
  fuelPricePerGallon: number;

  // --- Energy: electric path ---
  /** Efficiency in miles per kWh (used for electric). */
  milesPerKwh: number;
  electricityPricePerKwh: number;

  // --- Recurring costs ---
  annualInsurance: number;
  annualMaintenance: number;
  /** Cost of one full tire replacement (set of 4 + install). */
  tireReplacementCost: number;
  /** Expected mileage life of a set of tires. */
  tireLifeMiles: number;
  /** Annual reserve set aside for unscheduled repairs. */
  annualRepairReserve: number;

  // --- Capital recovery ---
  /**
   * Expected resale/trade value at the END of the ownership period.
   * Optional: when 0/blank the engine falls back to its depreciation curve.
   */
  expectedResaleValue: number;
  /** One-time incentives / tax credits (e.g. EV federal credit). */
  incentives: number;
}

/** The complete, validated input model the engine consumes. */
export interface CalculatorInput
  extends VehicleInput,
    FinancingInput,
    OwnershipInput {}

/** A single named cost line in the breakdown. */
export interface CostLine {
  key: CostKey;
  label: string;
  amount: number;
  /** Fixed (ownership) vs variable (usage-driven) per BTS framework. */
  group: "fixed" | "variable";
}

export type CostKey =
  | "depreciation"
  | "financing"
  | "insurance"
  | "energy"
  | "maintenance"
  | "tires"
  | "repairs";

/** Full cost breakdown for a single ownership horizon (in years). */
export interface HorizonBreakdown {
  years: number;
  lines: CostLine[];
  fixedTotal: number;
  variableTotal: number;
  /** Gross of incentives. */
  subtotal: number;
  incentives: number;
  /** subtotal - incentives. */
  total: number;
  monthlyAllIn: number;
  costPerMile: number;
  /** The single biggest cost line for this horizon. */
  largestDriver: CostLine;
}

/** Financing facts that are independent of the ownership horizon. */
export interface FinancingSummary {
  outTheDoorPrice: number;
  loanAmount: number;
  monthlyPayment: number;
  /** Interest over the FULL loan term. */
  totalInterestFullTerm: number;
}

/** Everything the results dashboard needs. */
export interface ResultSummary {
  input: CalculatorInput;
  financing: FinancingSummary;
  /** Breakdown keyed by horizon year (always includes 3, 5, and ownership). */
  horizons: Record<number, HorizonBreakdown>;
  /** Sorted, de-duplicated list of horizon years available. */
  horizonYears: number[];
  /** Cumulative total cost by year (index 0 = year 1). */
  cumulativeByYear: { year: number; total: number }[];
}
