/** Intro hero. Frames TCO as long-term cost, not sticker price. */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-700 to-brand-600 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="mb-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide">
          True Cost of Ownership
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          What a car <span className="text-brand-200">really</span> costs you —
          not just the sticker price.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-brand-100">
          MSRP and the monthly payment only tell part of the story. This
          calculator estimates your all-in cost of ownership over 3 and 5 years —
          depreciation, financing, taxes &amp; fees, insurance, fuel or energy,
          maintenance, tires, and repairs — so you can compare vehicles by what
          they actually cost to live with.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#calculator" className="btn-primary bg-white !text-brand-700 hover:bg-brand-50">
            Start estimating
          </a>
          <a
            href="#methodology"
            className="btn-ghost border-white/40 bg-transparent !text-white hover:bg-white/10"
          >
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}
