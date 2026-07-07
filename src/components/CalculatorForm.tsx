"use client";

import { useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorSchema, type CalculatorFormValues } from "@/lib/schema";
import { estimateResaleForVehicle } from "@/lib/calculations";
import { fmtCurrency } from "@/lib/format";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { DEFAULT_INPUT, DEFAULT_EV_INPUT } from "@/lib/defaults";
import {
  VEHICLE_BRANDS,
  VEHICLE_CATALOG,
  vehicleYears,
  buildVehicleName,
} from "@/lib/vehicleData";
import { InputSectionCard } from "./InputSectionCard";
import { NumberInputRow } from "./NumberInputRow";

/**
 * The full input form. Uses React Hook Form for editing state + Zod for
 * validation. Values are only committed to the global store when the user
 * clicks "Estimate Cost" — nothing recomputes while typing. Form logic stays
 * fully separate from the cost math (which lives in `lib/calculations.ts`).
 */
export function CalculatorForm() {
  const setInput = useCalculatorStore((s) => s.setInput);

  const methods = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: DEFAULT_INPUT,
    mode: "onChange",
  });

  const { watch, reset, getValues, handleSubmit } = methods;
  const vehicleType = watch("vehicleType");
  const isElectric = vehicleType === "electric";

  function applyPreset(preset: CalculatorFormValues) {
    reset(preset);
  }

  return (
    <FormProvider {...methods}>
      <form
        id="calculator"
        className="space-y-5"
        noValidate
        onSubmit={handleSubmit((values) => setInput(values))}
      >
        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Start from:</span>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => applyPreset(DEFAULT_INPUT)}
          >
            Typical gas car
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => applyPreset(DEFAULT_EV_INPUT)}
          >
            Typical EV
          </button>
        </div>

        {/* 1. Vehicle */}
        <InputSectionCard
          title="1. Vehicle"
          description="Start here — what are you buying and for how much?"
          collapsible={false}
        >
          <VehicleSelector />
          <VehicleTypeRow />
          <NumberInputRow
            name="otdPrice"
            label="Out-the-door (OTD) price"
            hint="What you'll actually pay, taxes and fees included"
            prefix="$"
            step={500}
          />
        </InputSectionCard>

        {/* 2. Financing */}
        <InputSectionCard
          title="2. Financing"
          description="How you'll pay. Only loan interest counts toward total cost."
        >
          <NumberInputRow name="downPayment" label="Down payment" prefix="$" step={500} />
          <NumberInputRow name="tradeInValue" label="Trade-in value" prefix="$" step={500} />
          <NumberInputRow name="apr" label="APR" suffix="%" step={0.1} max={40} />
          <NumberInputRow
            name="loanTermMonths"
            label="Loan term"
            suffix="mo"
            step={6}
            max={120}
          />
        </InputSectionCard>

        {/* 3. Ownership & usage */}
        <InputSectionCard
          title="3. Ownership & usage"
          description="How long you'll keep it and how much you drive."
          collapsible={false}
        >
          <NumberInputRow name="ownershipYears" label="Ownership period" suffix="yr" step={1} max={15} />
          <NumberInputRow name="annualMiles" label="Annual miles driven" suffix="mi" step={1000} />

          {isElectric ? (
            <>
              <NumberInputRow name="milesPerKwh" label="Efficiency" suffix="mi/kWh" step={0.1} />
              <NumberInputRow
                name="electricityPricePerKwh"
                label="Electricity price"
                prefix="$"
                suffix="/kWh"
                step={0.01}
              />
            </>
          ) : (
            <>
              <NumberInputRow name="mpg" label="Fuel economy" suffix="mpg" step={1} />
              <NumberInputRow
                name="fuelPricePerGallon"
                label="Fuel price"
                prefix="$"
                suffix="/gal"
                step={0.1}
              />
            </>
          )}
        </InputSectionCard>

        {/* 4. Recurring costs (advanced, collapsed by default) */}
        <InputSectionCard
          title="4. Recurring & repair costs"
          description="Insurance, upkeep, tires, and a repair reserve."
          defaultCollapsed
        >
          <NumberInputRow name="annualInsurance" label="Annual insurance" prefix="$" step={50} />
          <NumberInputRow name="annualMaintenance" label="Annual maintenance" prefix="$" step={50} />
          <NumberInputRow name="tireReplacementCost" label="Tire set cost" prefix="$" step={50} />
          <NumberInputRow
            name="tireLifeMiles"
            label="Tire life"
            suffix="mi"
            step={5000}
            min={1}
          />
          <NumberInputRow name="annualRepairReserve" label="Annual repair reserve" prefix="$" step={50} />
        </InputSectionCard>

        {/* 5. Resale & incentives (advanced) */}
        <InputSectionCard
          title="5. Resale & incentives"
          description="Optional. Leave resale at 0 to use our depreciation estimate."
          defaultCollapsed
        >
          <NumberInputRow
            name="expectedResaleValue"
            label="Expected resale value"
            hint="Value at end of ownership period"
            prefix="$"
            step={500}
          />
          <ResaleEstimateHint />
          <NumberInputRow
            name="incentives"
            label="Incentives / tax credits"
            prefix="$"
            step={250}
          />
        </InputSectionCard>

        <div className="flex items-center justify-between gap-4 px-1">
          <p className="text-xs text-slate-400">
            Current vehicle:{" "}
            <span className="font-medium text-slate-500">
              {getValues("name")}
            </span>
            .
          </p>
          <button type="submit" className="btn-primary">
            Estimate Cost
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

/* --- Inline rows for the non-numeric vehicle fields --- */

const YEAR_OPTIONS = vehicleYears();

/**
 * Structured vehicle picker: Year / Brand / Model / Current age. Model options
 * follow the chosen brand, and the human-readable `name` (used in results) is
 * derived from the selections so the rest of the app stays unchanged.
 */
function VehicleSelector() {
  const { register, watch, setValue, getValues } =
    useFormContext<CalculatorFormValues>();

  const year = watch("year");
  const brand = watch("brand");
  const model = watch("model");

  const modelOptions = VEHICLE_CATALOG[brand] ?? [];

  // Keep the model valid for the selected brand.
  useEffect(() => {
    if (modelOptions.length && !modelOptions.includes(getValues("model"))) {
      setValue("model", modelOptions[0], { shouldValidate: true });
    }
  }, [brand, modelOptions, getValues, setValue]);

  // Keep the derived display name in sync with the selections.
  useEffect(() => {
    setValue("name", buildVehicleName(year, brand, model), {
      shouldValidate: true,
    });
  }, [year, brand, model, setValue]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="year" className="field-label">
            Year
          </label>
          <select
            id="year"
            className="field-input mt-1 text-left"
            {...register("year")}
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="brand" className="field-label">
            Brand
          </label>
          <select
            id="brand"
            className="field-input mt-1 text-left"
            {...register("brand")}
          >
            {VEHICLE_BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="model" className="field-label">
            Model
          </label>
          <select
            id="model"
            className="field-input mt-1 text-left"
            {...register("model")}
          >
            {modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
}

/**
 * Live resale estimate for the selected vehicle, shown under the resale field.
 * Sourced from published depreciation studies (see lib/vehicleData.ts); tells
 * the user what the engine assumes if they leave the field at 0.
 */
function ResaleEstimateHint() {
  const { watch } = useFormContext<CalculatorFormValues>();

  const brand = watch("brand");
  const model = watch("model");
  const otdPrice = Number(watch("otdPrice"));
  const years = Number(watch("ownershipYears"));
  const userResale = Number(watch("expectedResaleValue"));

  const estimate = estimateResaleForVehicle(otdPrice, brand, model, years);
  if (!Number.isFinite(estimate) || estimate <= 0) return null;

  return (
    <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
      Based on resale-value studies, a {brand} {model} is typically worth{" "}
      <span className="font-semibold text-slate-700">
        ~{fmtCurrency(estimate)}
      </span>{" "}
      after {years} {years === 1 ? "year" : "years"}.
      {userResale > 0
        ? " Your value above overrides this estimate."
        : " Leave the field at 0 to use this estimate."}
    </p>
  );
}

function VehicleTypeRow() {
  const { register } = useFormContext<CalculatorFormValues>();
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3">
      <label htmlFor="vehicleType" className="field-label">
        Powertrain
      </label>
      <select
        id="vehicleType"
        className="field-input w-44 text-left"
        {...register("vehicleType")}
      >
        <option value="gas">Gasoline</option>
        <option value="hybrid">Hybrid</option>
        <option value="electric">Electric</option>
      </select>
    </div>
  );
}
