"use client";

import { useMemo, useState } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { calculateOwnership } from "@/lib/calculations";
import { fmtCurrency, fmtCurrencyCents } from "@/lib/format";
import { KpiCard } from "./KpiCard";
import { ResultsTable } from "./ResultsTable";
import { CostBreakdownChart } from "./charts/CostBreakdownChart";
import { YearComparisonChart } from "./charts/YearComparisonChart";
import { CumulativeCostChart } from "./charts/CumulativeCostChart";
import { FixedVariableChart } from "./charts/FixedVariableChart";

export function ResultsDashboard() {
  const input = useCalculatorStore((s) => s.input);

  // Single source of truth: results are derived from the committed input.
  const result = useMemo(() => calculateOwnership(input), [input]);

  const defaultHorizon = result.horizonYears.includes(Math.round(input.ownershipYears))
    ? Math.round(input.ownershipYears)
    : result.horizonYears[result.horizonYears.length - 1];

  const [horizon, setHorizon] = useState<number>(defaultHorizon);
  const activeYear = result.horizons[horizon] ? horizon : defaultHorizon;
  const active = result.horizons[activeYear];

  const compareBreakdowns = [3, 5]
    .filter((y) => result.horizons[y])
    .map((y) => result.horizons[y]);

  const fixedPct = active.subtotal
    ? Math.round((active.fixedTotal / active.subtotal) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header + horizon toggle */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{input.name}</h2>
          <p className="text-sm text-slate-500">
            Estimated all-in cost of ownership
          </p>
        </div>
        <div
          className="inline-flex rounded-lg border border-slate-200 bg-white p-1"
          role="tablist"
          aria-label="Ownership horizon"
        >
          {result.horizonYears.map((y) => (
            <button
              key={y}
              role="tab"
              aria-selected={activeYear === y}
              onClick={() => setHorizon(y)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                activeYear === y
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {y} years
            </button>
          ))}
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Monthly all-in"
          value={fmtCurrency(active.monthlyAllIn)}
          sublabel={`Over ${activeYear} years`}
          accent
        />
        <KpiCard
          label={`${activeYear}-year total`}
          value={fmtCurrency(active.total)}
          sublabel="Total cost of ownership"
        />
        <KpiCard
          label="Cost per mile"
          value={fmtCurrencyCents(active.costPerMile)}
          sublabel={`${fmtCurrency(input.annualMiles)} mi / year`}
        />
        <KpiCard
          label="Biggest cost driver"
          value={active.largestDriver.label}
          sublabel={fmtCurrency(active.largestDriver.amount)}
        />
      </div>

      {/* Breakdown + fixed/variable */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-1 text-base font-semibold text-slate-900">
            Where the money goes ({activeYear} years)
          </h3>
          <p className="mb-2 text-sm text-slate-500">
            Cost by category across your ownership period.
          </p>
          <CostBreakdownChart breakdown={active} />
        </div>
        <div className="card p-5">
          <h3 className="mb-1 text-base font-semibold text-slate-900">
            Fixed vs variable
          </h3>
          <p className="mb-2 text-sm text-slate-500">
            {fixedPct}% is fixed ownership cost; the rest scales with how much you
            drive.
          </p>
          <FixedVariableChart breakdown={active} />
        </div>
      </div>

      {/* Comparison + cumulative */}
      <div className="grid gap-6 lg:grid-cols-2">
        {compareBreakdowns.length === 2 && (
          <div className="card p-5">
            <h3 className="mb-1 text-base font-semibold text-slate-900">
              3-year vs 5-year cost
            </h3>
            <p className="mb-2 text-sm text-slate-500">
              Longer ownership spreads fixed costs over more time.
            </p>
            <YearComparisonChart breakdowns={compareBreakdowns} />
          </div>
        )}
        <div className="card p-5">
          <h3 className="mb-1 text-base font-semibold text-slate-900">
            Cumulative cost over time
          </h3>
          <p className="mb-2 text-sm text-slate-500">
            Total spent by the end of each year of ownership.
          </p>
          <CumulativeCostChart data={result.cumulativeByYear} />
        </div>
      </div>

      {/* Detail table */}
      <div className="card p-5">
        <h3 className="mb-3 text-base font-semibold text-slate-900">
          Detailed breakdown ({activeYear} years)
        </h3>
        <ResultsTable breakdown={active} />
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <Stat label="Out-the-door price" value={fmtCurrency(result.financing.outTheDoorPrice)} />
          <Stat label="Amount financed" value={fmtCurrency(result.financing.loanAmount)} />
          <Stat label="Monthly payment" value={fmtCurrency(result.financing.monthlyPayment)} />
          <Stat
            label="Interest (full term)"
            value={fmtCurrency(result.financing.totalInterestFullTerm)}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold tabular-nums text-slate-800">{value}</p>
    </div>
  );
}
