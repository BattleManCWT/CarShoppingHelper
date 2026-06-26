import { Hero } from "@/components/Hero";
import { CalculatorForm } from "@/components/CalculatorForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AssumptionsPanel } from "@/components/AssumptionsPanel";

export default function HomePage() {
  return (
    <main className="min-h-screen pb-20">
      <Hero />

      <div className="mx-auto max-w-6xl px-6">
        {/* Calculator: inputs on the left, live results on the right. */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <h2 className="mb-1 text-2xl font-bold text-slate-900">
              Build your estimate
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              Fill in what you know — results on the right update instantly.
            </p>
            <CalculatorForm />
          </div>

          <div>
            <ResultsDashboard />
          </div>
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
