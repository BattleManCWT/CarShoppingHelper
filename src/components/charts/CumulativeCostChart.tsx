"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fmtCurrency } from "@/lib/format";

/** Cumulative total ownership cost over time. */
export function CumulativeCostChart({
  data,
}: {
  data: { year: number; total: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ left: 8, right: 12, top: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            tickFormatter={(y: number) => `Yr ${y}`}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
            width={48}
          />
          <Tooltip
            formatter={(value: number) => [fmtCurrency(value), "Cumulative cost"]}
            labelFormatter={(y) => `Year ${y}`}
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#1e59f0"
            strokeWidth={3}
            dot={{ r: 4, fill: "#1e59f0" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
