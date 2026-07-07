# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server (http://localhost:3000; falls back to 3001 if busy)
npm run build      # production build
npm run lint       # next lint (ESLint, next/core-web-vitals)
npm run typecheck  # tsc --noEmit
```

There is no test suite yet. If adding one, the intended target is the pure engine in `src/lib/calculations.ts` (see README "Notes for future improvements").

## Architecture

Next.js 14 App Router + TypeScript + Tailwind, single page (`src/app/page.tsx`): inputs form on the left, live results dashboard on the right. Path alias `@/*` → `src/*`.

The core design rule is a strict separation between **cost math** and **UI/form state**:

- `src/lib/calculations.ts` — pure, dependency-free engine. `calculateOwnership(CalculatorInput) → ResultSummary` is where every dollar figure originates. No React imports here.
- `src/lib/types.ts` — the shared contract (`CalculatorInput`, `CostKey`, `HorizonBreakdown`, `ResultSummary`). Form, store, engine, and charts all speak these types.
- `src/lib/schema.ts` — Zod schema mirroring the input model (`z.coerce.number()` for native inputs; `superRefine` enforces powertrain-appropriate energy fields).
- `src/store/useCalculatorStore.ts` — tiny Zustand store holding only the *committed* `CalculatorInput`. No result state is stored anywhere.

Data flow (one direction, single source of truth):

```
CalculatorForm (React Hook Form, mode:"onChange")
  └─ watch() → calculatorSchema.safeParse → store.setInput   (only when valid)
       └─ ResultsDashboard: useMemo(() => calculateOwnership(input), [input])
            └─ KPI cards, charts, ResultsTable
```

The form owns transient editing state; the store only ever receives values that passed Zod. Presets (`lib/defaults.ts`) are applied by resetting the form *and* setting the store.

### Cost model invariant

`TCO = depreciation + financing(interest only) + insurance + energy + maintenance + tires + repairs − incentives`

Financing contributes **interest only** — principal/down payment are how the car is funded; the capital consumed is captured by depreciation (OTD price − resale). Don't add cost lines that re-count purchase capital. The out-the-door (OTD) price is entered directly (taxes/fees included) and is the basis for both depreciation and the loan.

### Adding or changing a cost category

A category is a `CostKey`. Touch all of: `types.ts` (`CostKey` union), `calculations.ts` (`CATEGORY_META` label + fixed/variable group, plus the amount computation), and `chartTheme.ts` (`COST_COLORS`) — charts and the table all key off `CostKey` so colors/labels stay consistent automatically.

### Vehicle catalog & depreciation data

`src/lib/vehicleData.ts` holds the curated brand→models catalog (drives the Section 1 dropdowns; brands alphabetized, models ordered roughly cars → SUVs → trucks → EVs) and published 5-year depreciation data (`BRAND_FIVE_YEAR_DEPRECIATION` + `MODEL_FIVE_YEAR_DEPRECIATION`, calibrated to the iSeeCars 2026 study / KBB resale rankings; fractions of price lost after 5 years). `depreciationFactor(brand, model)` converts a vehicle's published figure to the OTD basis (÷ `OTD_MARKUP` for baked-in taxes/fees) and returns the scale that makes the engine's baseline curve (`DEPRECIATION_CURVE` in calculations.ts) hit that 5-year point: <1 holds value better than the baseline, >1 sheds it faster. New brands should get a `BRAND_FIVE_YEAR_DEPRECIATION` entry or they silently fall back to the industry-average 41.8% loss.

### Styling

Reusable component classes (`.card`, `.field-input`, `.field-label`, `.field-error`, `.btn-primary`, `.btn-ghost`) are defined in `src/app/globals.css` via `@layer components`; use them instead of re-deriving Tailwind stacks. Brand color is the `brand-*` palette from `tailwind.config.ts`. Layout caveat: the right (results) column is capped at ~560–690px on desktop, so multi-up tiles get narrow — KPI tiles go 4-up only at `xl` and `KpiCard` shrinks long text values to keep them inside the card border.
