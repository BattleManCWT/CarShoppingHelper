"use client";

import { create } from "zustand";
import type { CalculatorInput } from "@/lib/types";

/**
 * Lightweight global store for the committed calculator inputs.
 *
 * The form (React Hook Form) owns transient editing state; values are only
 * pushed here when the user clicks "Estimate Cost" (after Zod validation).
 * `input` starts as `null` — the dashboard shows nothing until the first
 * estimate is requested. Results are derived from `input` with a memoized
 * selector in the dashboard, so there is a single source of truth and no
 * duplicated result state to keep in sync.
 */
interface CalculatorState {
  input: CalculatorInput | null;
  setInput: (input: CalculatorInput) => void;
  reset: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  input: null,
  setInput: (input) => set({ input }),
  reset: () => set({ input: null }),
}));
