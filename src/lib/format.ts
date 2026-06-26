/** Small presentation helpers shared across components. */

const currency0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currency2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const number0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Whole-dollar currency, e.g. $32,450. */
export function fmtCurrency(value: number): string {
  return currency0.format(Math.round(value));
}

/** Cents-precision currency, e.g. $0.58 (used for cost-per-mile). */
export function fmtCurrencyCents(value: number): string {
  return currency2.format(value);
}

export function fmtNumber(value: number): string {
  return number0.format(value);
}

export function fmtPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}
