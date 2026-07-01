"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { HorizonBreakdown } from "@/lib/types";
import { COST_COLORS } from "@/lib/chartTheme";
import { fmtCurrency } from "@/lib/format";

/** Donut chart of cost categories for one ownership horizon. */
export function CostBreakdownChart({ breakdown }: { breakdown: HorizonBreakdown }) {
  const data = breakdown.lines
    .filter((l) => l.amount > 0)
    .map((l) => ({ key: l.key, name: l.label, value: l.amount }));

  return (
    <div className="w-full">
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={1}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.key} fill={COST_COLORS[d.key]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [fmtCurrency(value), name]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend: color → category, with each category's share of the total. */}
      <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {data.map((d) => (
          <li key={d.key} className="flex items-center gap-2 text-sm text-slate-600">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COST_COLORS[d.key] }}
            />
            <span>{d.name}</span>
            <span className="font-medium text-slate-900">{fmtCurrency(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
