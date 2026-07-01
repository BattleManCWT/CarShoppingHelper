import type { CostKey } from "./types";

/** Stable color per cost category, reused across every chart for consistency. */
export const COST_COLORS: Record<CostKey, string> = {
  depreciation: "#1e59f0",
  financing: "#0891b2",
  insurance: "#0d9488",
  energy: "#f59e0b",
  maintenance: "#ef4444",
  tires: "#64748b",
  repairs: "#db2777",
};

export const GROUP_COLORS = {
  fixed: "#1e59f0",
  variable: "#f59e0b",
} as const;
