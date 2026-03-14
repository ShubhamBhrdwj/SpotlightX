import { Pill, SectionTitle } from "./UI";

export function PortalShell({
  eyebrow,
  title,
  description,
  stats,
  sidebarTitle,
  sidebarItems,
  children
}) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
      <aside className="h-fit rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-panel">
        <p className="text-xs uppercase tracking-[0.35em] text-stage-300">
          {sidebarTitle}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {sidebarItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-ink-900/70 px-4 py-3 text-sm text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
      </aside>

      <main className="space-y-6">
        <div className="rounded-[34px] border border-white/10 bg-mesh-glow bg-ink-900/90 p-8 shadow-glow">
          <SectionTitle
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <div className="mt-5 flex flex-wrap gap-3">
            <Pill tone="warm">Prototype mode</Pill>
            <Pill tone="mint">Manual verification ready</Pill>
            <Pill>Local backend data</Pill>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-black/20 p-5"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-black text-white">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-300">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
