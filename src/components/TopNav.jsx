import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function TopNav() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.organisationName || user?.name || "SX")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navItems = isAuthenticated
    ? [
        {
          to: user?.role === "artist" ? "/artist" : "/organiser",
          label: user?.role === "artist" ? "Artist Portal" : "Organizer Portal"
        },
        { to: "/verification", label: "Verification" }
      ]
    : [
        { to: "/", label: "Start" },
        { to: "/verification", label: "Verification" }
      ];

  function handleLogout() {
    logout();
    navigate("/auth");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to={isAuthenticated ? navItems[0].to : "/"} className="flex items-center gap-3">
          <div className="motion-card flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-mint-300/40 bg-white shadow-glow">
            <img
              src="/logo.jpeg"
              alt="SpotlightX"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-700">
              SpotlightX
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/artist" || item.to === "/organiser" || item.to === "/"}
                className={({ isActive }) =>
                  [
                    "motion-button rounded-full px-4 py-2 text-sm transition",
                    isActive
                      ? "bg-mint-400 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.profile?.coverImage ? (
                <img
                  src={user.profile.coverImage}
                  alt={user?.name || "Profile"}
                  className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="motion-card flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-bold text-slate-700">
                  {initials}
                </div>
              )}
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {user?.role}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="motion-button rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
