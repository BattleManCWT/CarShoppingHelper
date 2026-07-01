# Car TCO Calculator

Estimate the **true total cost of owning a car** — not just the out-the-door
price or the monthly payment. The app models the full cost of ownership over
**3 and 5 years** (plus your own horizon) across the mainstream categories
used by Edmunds' True Cost to Own and the BTS fixed-vs-variable cost
framework: depreciation, financing interest, insurance, fuel/energy,
maintenance, tires, and repairs — minus incentives.

Built with **Next.js (App Router) · React · TypeScript · Tailwind ·
React Hook Form + Zod · Recharts · Zustand**.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Architecture overview

The app is organized around a strict separation between **cost math** and
**UI/form state** so each can be reasoned about and tested independently.

- **`src/lib/calculations.ts` — the engine.** Pure, dependency-free functions
  that turn a `CalculatorInput` into a `ResultSummary`. No React, no state.
  This is where every dollar figure originates, which makes the math trivially
  unit-testable.
- **`src/lib/types.ts` — the contract.** Small, focused input groups
  (`VehicleInput`, `FinancingInput`, `OwnershipInput`) plus the
  result shapes (`HorizonBreakdown`, `ResultSummary`). The form, store, and
  charts all speak these types.
- **`src/lib/schema.ts` — validation.** A Zod schema mirroring the input model,
  with `z.coerce.number()` for native number inputs and a `superRefine` that
  enforces powertrain-appropriate energy fields.
- **`src/store/useCalculatorStore.ts` — single source of truth.** A tiny
  Zustand store holds the *committed* inputs. The form owns transient editing
  state (React Hook Form) and live-pushes valid values into the store; the
  dashboard derives results from the store with a memoized selector. There is no
  duplicated result state to keep in sync.
- **`src/components/*` — presentational UI.** Components read the store/form and
  render. Charts live under `components/charts/` and share a single color theme
  (`lib/chartTheme.ts`) so a category is the same color everywhere.

Data flow:

```
form edits ─(RHF, validated by Zod)─► store.input ─(useMemo)─► calculateOwnership ─► dashboard + charts
```

### Cost model (avoiding double counting)

```
TCO = depreciation + financing(interest only)
    + insurance + fuel/energy + maintenance + tires + repairs
    - incentives
```

Financing contributes **only interest**, because loan principal and down
payment are *how* you fund the car — the capital actually consumed is captured
by depreciation (purchase basis − resale value). Key formulas:

- **Out-the-door (OTD) price** is entered directly — it's what you'll actually
  pay, taxes and fees already included, and is the depreciation/loan basis
- **Loan amount** = OTD − down payment − trade-in − incentives
- **Monthly payment** = standard fixed-rate amortization from APR & term
- **Financing cost** = interest paid within your ownership window, walked from
  the amortization schedule (so selling before payoff is handled correctly)
- **Depreciation** follows a typical curve (~20% year 1, ~60% by year 5); if you
  enter a resale value it scales the curve to match at your ownership horizon
- **Energy** = miles ÷ MPG × fuel price (gas/hybrid) or miles ÷ mi-per-kWh ×
  electricity price (EV)
- **Fixed vs variable** = depreciation/financing/insurance (fixed) vs
  energy/maintenance/tires/repairs (usage-driven), per the BTS split

See **Methodology & assumptions** in-app for the full list of simplifications.

## Project structure

```
src/
  app/
    layout.tsx            # Root layout + metadata
    page.tsx              # Composes hero, form, dashboard, methodology
    globals.css           # Tailwind + reusable .card/.field-* component classes
  components/
    Hero.tsx              # Intro / value prop
    CalculatorForm.tsx    # RHF form, presets, live-sync to store
    InputSectionCard.tsx  # Collapsible titled input group
    NumberInputRow.tsx    # Label + numeric input + inline error
    KpiCard.tsx           # Headline metric tile
    ResultsDashboard.tsx  # KPIs, horizon toggle, charts, table
    ResultsTable.tsx      # Per-category detail table
    AssumptionsPanel.tsx  # Methodology + what's entered vs estimated
    charts/
      CostBreakdownChart.tsx   # Donut: cost by category
      YearComparisonChart.tsx  # Stacked bar: 3yr vs 5yr
      CumulativeCostChart.tsx  # Line: cumulative cost over time
      FixedVariableChart.tsx   # Pie: fixed vs variable split
  lib/
    types.ts              # Domain + result types
    calculations.ts       # Pure cost engine
    schema.ts             # Zod validation
    defaults.ts           # Gas + EV starter presets
    format.ts             # Currency/number formatting
    chartTheme.ts         # Shared category colors
  store/
    useCalculatorStore.ts # Zustand store of committed inputs
```

## Notes for future improvements

- **Side-by-side vehicle comparison** — the store/engine are already
  vehicle-agnostic; add a second `CalculatorInput` and diff two `ResultSummary`s.
- **Persistence** — drop the store into `localStorage` (or URL params) so an
  estimate survives a refresh and is shareable. Intentionally omitted from the
  MVP to avoid premature complexity.
- **Cost escalation** — model maintenance/repairs rising with age and out-of-
  warranty cliffs instead of flat annual amounts.
- **Regional data** — pull real depreciation curves, tax rates, and energy
  prices by ZIP/model rather than generic defaults.
- **Tests** — the pure engine in `lib/calculations.ts` is ready for unit tests
  (Vitest/Jest); add fixtures asserting the formulas above.

> Estimates only — not financial advice.
