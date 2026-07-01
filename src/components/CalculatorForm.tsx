"use client";

import { useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorSchema, type CalculatorFormValues } from "@/lib/schema";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { DEFAULT_INPUT, DEFAULT_EV_INPUT } from "@/lib/defaults";
import { InputSectionCard } from "./InputSectionCard";
import { NumberInputRow } from "./NumberInputRow";

/**
 * The full input form. Uses React Hook Form for editing state + Zod for
 * validation, and live-pushes valid values into the global store so the results
 * dashboard recomputes as you type. Form logic stays fully separate from the
 * cost math (which lives in `lib/calculations.ts`).
 */
export function CalculatorForm() {
  const input = useCalculatorStore((s) => s.input);
  const setInput = useCalculatorStore((s) => s.setInput);

  const methods = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: input,
    mode: "onChange",
  });

  const { watch, reset, getValues } = methods;
  const vehicleType = watch("vehicleType");
  const isElectric = vehicleType === "electric";

  // Live-sync: whenever the form is valid, commit values to the store.
  useEffect(() => {
    const sub = watch((values) => {
      const parsed = calculatorSchema.safeParse(values);
      if (parsed.success) setInput(parsed.data);
    });
    return () => sub.unsubscribe();
  }, [watch, setInput]);

  function applyPreset(preset: CalculatorFormValues) {
    reset(preset);
    setInput(preset);
  }

  return (
    <FormProvider {...methods}>
      <form
        id="calculator"
        className="space-y-5"
        onSubmit={(e) => e.preventDefault()}
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
          <VehicleNameRow />
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
          <NumberInputRow
            name="incentives"
            label="Incentives / tax credits"
            prefix="$"
            step={250}
          />
        </InputSectionCard>

        <p className="px-1 text-xs text-slate-400">
          Results update automatically as you edit. Current vehicle:{" "}
          <span className="font-medium text-slate-500">{getValues("name")}</span>.
        </p>
      </form>
    </FormProvider>
  );
}

/* --- Inline rows for the non-numeric vehicle fields --- */

function VehicleNameRow() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CalculatorFormValues>();

  return (
    <div>
      <label htmlFor="name" className="field-label">
        Vehicle name
      </label>
      <input
        id="name"
        type="text"
        placeholder="e.g. 2024 Honda Accord"
        className="field-input mt-1 text-left"
        {...register("name")}
      />
      {errors.name && <p className="field-error">{errors.name.message}</p>}
    </div>
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
