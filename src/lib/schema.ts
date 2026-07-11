import { z } from "zod";

/**
 * Zod schema for the calculator form. Mirrors `CalculatorInput`.
 *
 * Numeric fields use `z.coerce.number()` so native number inputs (which yield
 * strings) validate cleanly. Bounds are practical guard-rails, not policy.
 */

const money = (max = 2_000_000) =>
  z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .min(0, "Must be 0 or more")
    .max(max, "That seems too high");

export const calculatorSchema = z
  .object({
    // Vehicle
    name: z.string().trim().min(1, "Give the vehicle a name").max(80),
    year: z.coerce
      .number()
      .int("Whole year only")
      .min(1980, "Pick a model year")
      .max(new Date().getFullYear() + 2, "That year is too far out"),
    brand: z.string().trim().min(1, "Pick a brand"),
    model: z.string().trim().min(1, "Pick a model"),
    vehicleType: z.enum(["gas", "hybrid", "electric"]),
    condition: z.enum(["new", "used"]),
    otdPrice: money().min(1, "Enter the out-the-door price"),

    // Financing
    paymentMethod: z.enum(["cash", "finance"]),
    downPayment: money(),
    tradeInValue: money(),
    apr: z.coerce.number().min(0, "Must be 0 or more").max(40, "APR seems too high"),
    loanTermMonths: z.coerce
      .number()
      .int("Whole months only")
      .min(0, "Must be 0 or more")
      .max(120, "120 months max"),

    // Ownership & usage
    ownershipYears: z.coerce
      .number()
      .min(1, "At least 1 year")
      .max(15, "15 years max"),
    annualMiles: z.coerce.number().min(0).max(200_000, "That seems too high"),

    mpg: z.coerce.number().min(0).max(200),
    fuelPricePerGallon: money(50),
    milesPerKwh: z.coerce.number().min(0).max(20),
    electricityPricePerKwh: money(5),

    annualInsurance: money(100_000),
    annualMaintenance: money(100_000),
    tireReplacementCost: money(20_000),
    tireLifeMiles: z.coerce.number().min(1, "Must be more than 0").max(200_000),
    annualRepairReserve: money(100_000),

    expectedResaleValue: money(),
    incentives: money(100_000),
  })
  .superRefine((data, ctx) => {
    // A financed purchase needs an actual loan term; cash ignores these fields.
    if (data.paymentMethod === "finance" && data.loanTermMonths < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["loanTermMonths"],
        message: "Enter the loan term",
      });
    }

    // Energy inputs must be sensible for the selected powertrain.
    if (data.vehicleType === "electric") {
      if (data.milesPerKwh <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["milesPerKwh"],
          message: "Enter efficiency in miles per kWh",
        });
      }
    } else if (data.mpg <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mpg"],
        message: "Enter the vehicle's MPG",
      });
    }
  });

export type CalculatorFormValues = z.infer<typeof calculatorSchema>;
