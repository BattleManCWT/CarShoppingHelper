"use client";

import type { HorizonBreakdown } from "@/lib/types";
import { COST_COLORS } from "@/lib/chartTheme";
import { fmtCurrency } from "@/lib/format";

/** Detailed per-category table for one ownership horizon. */
export function ResultsTable({ breakdown }: { breakdown: HorizonBreakdown }) {
  const total = breakdown.subtotal || 1;
  const months = breakdown.years * 12;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2.5 font-medium">Category</th>
            <th className="px-4 py-2.5 text-right font-medium">/ month</th>
            <th className="px-4 py-2.5 text-right font-medium">
              {breakdown.years}-yr total
            </th>
            <th className="px-4 py-2.5 text-right font-medium">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {breakdown.lines.map((line) => (
            <tr key={line.key} className="hover:bg-slate-50">
              <td className="px-4 py-2.5">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: COST_COLORS[line.key] }}
                  />
                  {line.label}
                  <span className="text-xs text-slate-400">
                    ({line.group})
                  </span>
                </span>
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">
                {fmtCurrency(line.amount / months)}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                {fmtCurrency(line.amount)}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">
                {Math.round((line.amount / total) * 100)}%
              </td>
            </tr>
          ))}

          {breakdown.incentives > 0 && (
            <tr className="bg-emerald-50/50">
              <td className="px-4 py-2.5 text-emerald-700">Incentives / credits</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-emerald-700">
                −{fmtCurrency(breakdown.incentives / months)}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums font-medium text-emerald-700">
                −{fmtCurrency(breakdown.incentives)}
              </td>
              <td className="px-4 py-2.5" />
            </tr>
          )}
        </tbody>
        <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
          <tr>
            <td className="px-4 py-3">Total cost of ownership</td>
            <td className="px-4 py-3 text-right tabular-nums">
              {fmtCurrency(breakdown.monthlyAllIn)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-brand-700">
              {fmtCurrency(breakdown.total)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-slate-400">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
