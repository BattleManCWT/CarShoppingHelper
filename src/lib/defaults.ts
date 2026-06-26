import type { CalculatorInput } from "./types";

/**
 * Sensible starting point for a typical mainstream gasoline sedan/crossover.
 * Every value is editable in the form — these just make the app useful on load.
 */
export const DEFAULT_INPUT: CalculatorInput = {
  // Vehicle
  name: "2024 Gasoline Sedan",
  vehicleType: "gas",
  msrp: 32000,

  // Financing
  downPayment: 4000,
  tradeInValue: 0,
  apr: 6.5,
  loanTermMonths: 60,

  // Taxes & fees
  salesTaxRate: 7.25,
  titleFee: 75,
  registrationFee: 350,
  dealerFees: 695,

  // Ownership & usage
  ownershipYears: 5,
  annualMiles: 12000,
  mpg: 32,
  fuelPricePerGallon: 3.6,
  milesPerKwh: 3.5,
  electricityPricePerKwh: 0.16,

  annualInsurance: 1600,
  annualMaintenance: 700,
  tireReplacementCost: 800,
  tireLifeMiles: 45000,
  annualRepairReserve: 500,

  expectedResaleValue: 0, // 0 => use the engine's depreciation curve
  incentives: 0,
};

/**
 * A second realistic preset (a typical EV) so the comparison story is one click
 * away. Not wired into the form by default, but exported for convenience/tests.
 */
export const DEFAULT_EV_INPUT: CalculatorInput = {
  ...DEFAULT_INPUT,
  name: "2024 Electric Crossover",
  vehicleType: "electric",
  msrp: 44000,
  annualInsurance: 1900,
  annualMaintenance: 450,
  incentives: 7500,
};
