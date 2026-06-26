"use client";

import {
  useFormContext,
  type FieldError,
  type Path,
} from "react-hook-form";
import type { CalculatorFormValues } from "@/lib/schema";

interface NumberInputRowProps {
  name: Path<CalculatorFormValues>;
  label: string;
  hint?: string;
  /** Adornment shown before the value, e.g. "$". */
  prefix?: string;
  /** Adornment shown after the value, e.g. "%", "mi", "/gal". */
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}

/** A label + numeric input + inline error, wired to the surrounding RHF form. */
export function NumberInputRow({
  name,
  label,
  hint,
  prefix,
  suffix,
  step = 1,
  min = 0,
  max,
}: NumberInputRowProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CalculatorFormValues>();

  const error = errors[name] as FieldError | undefined;

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3">
      <div>
        <label htmlFor={name} className="field-label">
          {label}
        </label>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>

      <div className="flex items-center gap-1.5">
        {prefix && <span className="text-sm text-slate-400">{prefix}</span>}
        <input
          id={name}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          className="field-input w-32"
          aria-invalid={!!error}
          {...register(name)}
        />
        {suffix && (
          <span className="w-8 text-left text-sm text-slate-400">{suffix}</span>
        )}
      </div>

      {error && (
        <p className="field-error col-span-2 text-right">{error.message}</p>
      )}
    </div>
  );
}
