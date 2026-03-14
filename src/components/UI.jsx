export function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-mint-400">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}

export function Pill({ children, tone = "default" }) {
  const tones = {
    default: "border-slate-200 bg-slate-100 text-slate-700",
    warm: "border-stage-300 bg-stage-100 text-stage-700",
    mint: "border-mint-300 bg-mint-400/10 text-mint-500"
  };

  return (
    <span
      className={`motion-chip inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function InfoCard({ title, description, children, className = "" }) {
  return (
    <div
      className={`motion-card rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel ${className}`}
    >
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

export function StatCard({ label, value, subtext }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{subtext}</p>
    </div>
  );
}
