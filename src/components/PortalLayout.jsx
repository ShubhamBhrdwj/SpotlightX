import { NavLink, Outlet } from "react-router-dom";
import { SectionTitle } from "./UI";

export function PortalLayout({
  eyebrow,
  title,
  description,
  stats,
  sidebarTitle,
  navItems
}) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
      <aside className="h-fit rounded-[30px] border border-slate-200 bg-white p-6 shadow-panel">
        <p className="text-xs uppercase tracking-[0.35em] text-mint-400">
          {sidebarTitle}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "motion-button rounded-2xl border px-4 py-3 text-sm transition",
                  isActive
                    ? "border-mint-300/40 bg-mint-400/10 text-mint-500"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>

      <main className="space-y-6">
        <div className="rounded-[34px] border border-slate-200 bg-mesh-glow bg-white p-8 shadow-glow">
          <SectionTitle
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-black text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-600">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
