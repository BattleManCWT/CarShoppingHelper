"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CostKey, HorizonBreakdown } from "@/lib/types";
import { COST_COLORS } from "@/lib/chartTheme";
import { fmtCurrency } from "@/lib/format";

/**
 * Stacked bars comparing total cost across horizons (e.g. 3yr vs 5yr), broken
 * out by cost category.
 */
export function YearComparisonChart({
  breakdowns,
}: {
  breakdowns: HorizonBreakdown[];
}) {
  // One row per horizon; one numeric field per category key.
  const data = breakdowns.map((b) => {
    const row: Record<string, number | string> = { name: `${b.years} years` };
    for (const line of b.lines) row[line.key] = line.amount;
    return row;
  });

  const keys = (breakdowns[0]?.lines.map((l) => l.key) ?? []) as CostKey[];
  const labelFor = (k: CostKey) =>
    breakdowns[0].lines.find((l) => l.key === k)?.label ?? k;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
            width={48}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              fmtCurrency(value),
              labelFor(name as CostKey),
            ]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
          />
          {keys.map((k) => (
            <Bar key={k} dataKey={k} stackId="cost" fill={COST_COLORS[k]} maxBarSize={90} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
