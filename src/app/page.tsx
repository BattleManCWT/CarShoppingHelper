import { Hero } from "@/components/Hero";
import { CalculatorForm } from "@/components/CalculatorForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AssumptionsPanel } from "@/components/AssumptionsPanel";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function HomePage() {
  return (
    <main className="min-h-screen pb-20">
      <ScrollToTop />
      <Hero />

      <div className="mx-auto max-w-6xl px-6">
        {/* Calculator: inputs on top, live results below. */}
        <section className="mt-10 space-y-10">
          <div>
            <h2 className="mb-1 text-2xl font-bold text-slate-900">
              Build your estimate
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              Fill in what you know, then click Estimate Cost to see the
              results below.
            </p>
            <CalculatorForm />
          </div>

          <ResultsDashboard />
        </section>

        <div className="mt-12">
          <AssumptionsPanel />
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          Estimates only — not financial advice. Inspired by the Edmunds True
          Cost to Own and BTS fixed/variable cost frameworks.
        </footer>
      </div>
    </main>
  );
}
