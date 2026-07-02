interface KpiCardProps {
  label: string;
  value: string;
  sublabel?: string;
  accent?: boolean;
}

/** A single headline metric tile for the results dashboard. */
export function KpiCard({ label, value, sublabel, accent }: KpiCardProps) {
  // Tiles are narrow when 4-up; long text values (e.g. "Depreciation") need a
  // smaller size than short currency figures to stay inside the card.
  const valueSize = value.length > 8 ? "text-lg" : "text-2xl";

  return (
    <div
      className={`card min-w-0 p-4 sm:p-5 ${
        accent ? "border-brand-200 bg-brand-50" : ""
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1 break-words font-bold leading-snug tabular-nums ${valueSize} ${
          accent ? "text-brand-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
      {sublabel && <p className="mt-0.5 text-xs text-slate-400">{sublabel}</p>}
    </div>
  );
}
