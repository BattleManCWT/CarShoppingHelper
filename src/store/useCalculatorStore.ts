"use client";

import { create } from "zustand";
import { DEFAULT_INPUT, DEFAULT_EV_INPUT } from "@/lib/defaults";
import type { CalculatorInput } from "@/lib/types";

/**
 * Lightweight global store for the committed calculator inputs.
 *
 * The form (React Hook Form) owns transient editing state; once values are valid
 * it pushes them here via `setInput`. Results are derived from `input` with a
 * memoized selector in the dashboard, so there is a single source of truth and
 * no duplicated result state to keep in sync.
 */
interface CalculatorState {
  input: CalculatorInput;
  setInput: (input: CalculatorInput) => void;
  loadPreset: (preset: "gas" | "ev") => void;
  reset: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  input: DEFAULT_INPUT,
  setInput: (input) => set({ input }),
  loadPreset: (preset) =>
    set({ input: preset === "ev" ? DEFAULT_EV_INPUT : DEFAULT_INPUT }),
  reset: () => set({ input: DEFAULT_INPUT }),
}));
