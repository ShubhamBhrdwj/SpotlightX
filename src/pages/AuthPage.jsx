import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { InfoCard, Pill } from "../components/UI";

const demoCredentials = {
  artist: {
    email: "mira@spotlightx.demo",
    password: "password123"
  },
  organiser: {
    email: "organiser@spotlightx.demo",
    password: "password123"
  }
};

function AuthInput({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-mint-300 focus:bg-white"
      />
    </label>
  );
}

function ModeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "motion-button rounded-full px-4 py-2 text-sm font-semibold transition",
        active
          ? "bg-mint-400 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [artistForm, setArtistForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    category: ""
  });
  const [organiserForm, setOrganiserForm] = useState({
    name: "",
    organisationName: "",
    email: "",
    password: "",
    city: "",
    venue: ""
  });
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  function redirectByRole(user) {
    navigate(user.role === "artist" ? "/artist" : "/organiser");
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoadingAction("login");

    try {
      const user = await login(loginForm);
      redirectByRole(user);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoadingAction("");
    }
  }

  async function handleRegisterArtist(event) {
    event.preventDefault();
    setError("");
    setLoadingAction("artist-register");

    try {
      const user = await register({
        name: artistForm.name,
        email: artistForm.email,
        password: artistForm.password,
        role: "artist",
        city: artistForm.city,
        genres: artistForm.category
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
      });
      redirectByRole(user);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoadingAction("");
    }
  }

  async function handleRegisterOrganiser(event) {
    event.preventDefault();
    setError("");
    setLoadingAction("organiser-register");

    try {
      const user = await register({
        name: organiserForm.name,
        organisationName: organiserForm.organisationName,
        email: organiserForm.email,
        password: organiserForm.password,
        role: "organiser",
        city: organiserForm.city,
        venueTypes: organiserForm.venue
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
      });
      redirectByRole(user);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoadingAction("");
    }
  }

  async function quickDemo(role) {
    setError("");
    setLoadingAction(`quick-${role}`);

    try {
      const user = await login(demoCredentials[role]);
      redirectByRole(user);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoadingAction("");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-panel sm:p-8">
          <Pill tone="mint">Get Started</Pill>

          <div className="mt-8">
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Choose your role and build your presence.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              SpotlightX connects performing artists with event organizers through
              verified profiles, event discovery, booking conversations, and sponsor-ready opportunities.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-mint-400">
                For artists
              </p>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Register to get discovered and booked.
              </h2>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  Verified profile with genres, pricing, portfolio, and city.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  Browse real event opportunities and apply with a message.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  Receive booking replies, status updates, and sponsor opportunities in one inbox.
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-stage-500">
                For organizers
              </p>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Register to find talent and manage event listings.
              </h2>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  Build a verified venue and organization profile.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  Create event listings, review applications, and shortlist artists.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  Launch sponsorship proposals and handle communication from the same portal.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[34px] border border-slate-200 bg-white p-4 shadow-panel sm:p-6">
          <div className="flex flex-wrap gap-2">
            <ModeButton active={mode === "login"} onClick={() => setMode("login")}>
              Login
            </ModeButton>
            <ModeButton
              active={mode === "artist"}
              onClick={() => setMode("artist")}
            >
              Artist Register
            </ModeButton>
            <ModeButton
              active={mode === "organiser"}
              onClick={() => setMode("organiser")}
            >
              Organizer Register
            </ModeButton>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {mode === "login" ? (
            <InfoCard
              title="Login"
              description="Use one login form and continue to the right workspace."
              className="mt-4 bg-transparent p-0 shadow-none"
            >
              <form className="mt-5 space-y-4" onSubmit={handleLogin}>
                <AuthInput
                  label="Email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      email: event.target.value
                    }))
                  }
                  placeholder="Enter your email"
                />
                <AuthInput
                  label="Password"
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      password: event.target.value
                    }))
                  }
                  placeholder="Enter your password"
                />
                <button
                  type="submit"
                  className="motion-button w-full rounded-2xl bg-mint-400 px-5 py-3 text-sm font-bold text-white transition hover:bg-mint-500"
                >
                  {loadingAction === "login" ? "Logging in..." : "Login"}
                </button>
              </form>
            </InfoCard>
          ) : null}

          {mode === "artist" ? (
            <InfoCard
              title="Register as Artist"
              description="Create your artist account to start browsing events."
              className="mt-4 bg-transparent p-0 shadow-none"
            >
              <form
                className="mt-5 grid gap-4 md:grid-cols-2"
                onSubmit={handleRegisterArtist}
              >
                <AuthInput
                  label="Full name"
                  value={artistForm.name}
                  onChange={(event) =>
                    setArtistForm((current) => ({
                      ...current,
                      name: event.target.value
                    }))
                  }
                  placeholder="Artist name"
                />
                <AuthInput
                  label="City"
                  value={artistForm.city}
                  onChange={(event) =>
                    setArtistForm((current) => ({
                      ...current,
                      city: event.target.value
                    }))
                  }
                  placeholder="Your city"
                />
                <AuthInput
                  label="Email"
                  value={artistForm.email}
                  onChange={(event) =>
                    setArtistForm((current) => ({
                      ...current,
                      email: event.target.value
                    }))
                  }
                  placeholder="Artist email"
                />
                <AuthInput
                  label="Password"
                  type="password"
                  value={artistForm.password}
                  onChange={(event) =>
                    setArtistForm((current) => ({
                      ...current,
                      password: event.target.value
                    }))
                  }
                  placeholder="Create password"
                />
                <div className="md:col-span-2">
                  <AuthInput
                    label="Category / genres"
                    value={artistForm.category}
                    onChange={(event) =>
                      setArtistForm((current) => ({
                        ...current,
                        category: event.target.value
                      }))
                    }
                    placeholder="Singer, acoustic, indie"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="motion-button w-full rounded-2xl bg-mint-400 px-5 py-3 text-sm font-bold text-white transition hover:bg-mint-500"
                  >
                    {loadingAction === "artist-register"
                      ? "Creating artist account..."
                      : "Register artist"}
                  </button>
                </div>
              </form>
            </InfoCard>
          ) : null}

          {mode === "organiser" ? (
            <InfoCard
              title="Register as Organizer"
              description="Create your organizer account to manage events and bookings."
              className="mt-4 bg-transparent p-0 shadow-none"
            >
              <form
                className="mt-5 grid gap-4 md:grid-cols-2"
                onSubmit={handleRegisterOrganiser}
              >
                <AuthInput
                  label="Contact name"
                  value={organiserForm.name}
                  onChange={(event) =>
                    setOrganiserForm((current) => ({
                      ...current,
                      name: event.target.value
                    }))
                  }
                  placeholder="Organizer contact"
                />
                <AuthInput
                  label="City"
                  value={organiserForm.city}
                  onChange={(event) =>
                    setOrganiserForm((current) => ({
                      ...current,
                      city: event.target.value
                    }))
                  }
                  placeholder="Organizer city"
                />
                <AuthInput
                  label="Organization name"
                  value={organiserForm.organisationName}
                  onChange={(event) =>
                    setOrganiserForm((current) => ({
                      ...current,
                      organisationName: event.target.value
                    }))
                  }
                  placeholder="Organization name"
                />
                <AuthInput
                  label="Password"
                  type="password"
                  value={organiserForm.password}
                  onChange={(event) =>
                    setOrganiserForm((current) => ({
                      ...current,
                      password: event.target.value
                    }))
                  }
                  placeholder="Create password"
                />
                <div className="md:col-span-2">
                  <AuthInput
                    label="Email"
                    value={organiserForm.email}
                    onChange={(event) =>
                      setOrganiserForm((current) => ({
                        ...current,
                        email: event.target.value
                      }))
                    }
                    placeholder="Organizer email"
                  />
                </div>
                <div className="md:col-span-2">
                  <AuthInput
                    label="Venue / event type"
                    value={organiserForm.venue}
                    onChange={(event) =>
                      setOrganiserForm((current) => ({
                        ...current,
                        venue: event.target.value
                      }))
                    }
                    placeholder="Bar, college fest, wedding"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="motion-button w-full rounded-2xl bg-mint-400 px-5 py-3 text-sm font-bold text-white transition hover:bg-mint-500"
                  >
                    {loadingAction === "organiser-register"
                      ? "Creating organizer account..."
                      : "Register organizer"}
                  </button>
                </div>
              </form>
            </InfoCard>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Demo access
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => quickDemo("artist")}
                className="motion-button rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-200"
              >
                {loadingAction === "quick-artist" ? "Artist..." : "Artist Demo"}
              </button>
              <button
                type="button"
                onClick={() => quickDemo("organiser")}
                className="motion-button rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-200"
              >
                {loadingAction === "quick-organiser"
                  ? "Organizer..."
                  : "Organizer Demo"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
