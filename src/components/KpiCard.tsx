interface KpiCardProps {
  label: string;
  value: string;
  sublabel?: string;
  accent?: boolean;
}

/** A single headline metric tile for the results dashboard. */
export function KpiCard({ label, value, sublabel, accent }: KpiCardProps) {
  return (
    <div
      className={`card p-5 ${
        accent ? "border-brand-200 bg-brand-50" : ""
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-bold tabular-nums ${
          accent ? "text-brand-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
      {sublabel && <p className="mt-0.5 text-xs text-slate-400">{sublabel}</p>}
    </div>
  );
}
