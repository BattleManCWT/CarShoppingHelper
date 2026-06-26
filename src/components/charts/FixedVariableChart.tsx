"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { HorizonBreakdown } from "@/lib/types";
import { GROUP_COLORS } from "@/lib/chartTheme";
import { fmtCurrency } from "@/lib/format";

/**
 * Fixed (ownership) vs variable (usage-driven) cost split, per the BTS
 * fixed/variable cost framework.
 */
export function FixedVariableChart({ breakdown }: { breakdown: HorizonBreakdown }) {
  const data = [
    { name: "Fixed (ownership)", value: breakdown.fixedTotal, color: GROUP_COLORS.fixed },
    { name: "Variable (usage)", value: breakdown.variableTotal, color: GROUP_COLORS.variable },
  ];

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius="85%" stroke="none">
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [fmtCurrency(value), name]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
