/** Explains what's user-entered vs estimated, and the simplifications made. */
export function AssumptionsPanel() {
  return (
    <section id="methodology" className="card p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Methodology & assumptions
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        This tool estimates total cost of ownership (TCO) using the mainstream
        category framework popularized by Edmunds&apos; True Cost to Own and the
        fixed-vs-variable cost split used in federal (BTS) transportation cost
        analysis. It is an estimate to support comparison — not a quote.
      </p>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            What you enter
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
            <li>• Vehicle price, down payment, trade-in, APR and loan term</li>
            <li>• Sales tax rate plus title, registration and dealer fees</li>
            <li>• Ownership length, annual mileage and energy efficiency</li>
            <li>• Insurance, maintenance, tires and a repair reserve</li>
            <li>• Optional resale value and incentives / tax credits</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            How we estimate
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
            <li>
              • <strong>Depreciation</strong> follows a typical curve (~20% in
              year one, ~60% by year five). If you enter a resale value, we scale
              the curve to match it at your ownership horizon.
            </li>
            <li>
              • <strong>Financing</strong> counts only loan interest, computed
              from the amortization schedule over your ownership period — loan
              principal is already captured by depreciation.
            </li>
            <li>
              • <strong>Energy</strong> uses miles ÷ MPG × fuel price (or miles ÷
              mi-per-kWh × electricity price for EVs).
            </li>
            <li>
              • <strong>Tires</strong> are allocated by mileage; maintenance,
              insurance and repairs are treated as flat annual amounts.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-amber-50 p-4 text-xs text-amber-800">
        <strong>Simplifications:</strong> sales tax is applied to price minus
        trade-in; maintenance and insurance don&apos;t escalate with vehicle age;
        depreciation uses a generic curve unless you override resale value; and
        regional/credit-score variation isn&apos;t modeled. Adjust the inputs to
        match your situation for the most accurate picture.
      </div>
    </section>
  );
}
