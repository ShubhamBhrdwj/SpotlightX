import { useState } from "react";
import { InfoCard } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

export function ArtistProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.profile?.city || "",
    bio: user?.profile?.bio || "",
    genres: (user?.profile?.genres || []).join(", "),
    priceRange: user?.profile?.priceRange || ""
  });
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Saving...");

    try {
      const updated = await api.put("/api/artists/me/profile", {
        name: form.name,
        phone: form.phone,
        profile: {
          city: form.city,
          bio: form.bio,
          genres: form.genres
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean),
          priceRange: form.priceRange
        }
      });

      updateUser(updated);
      setStatus("Profile saved.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <InfoCard
      title="Profile management"
      description="Keep your public details and preferences up to date."
    >
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        {[
          ["Full name", "name"],
          ["Phone", "phone"],
          ["City", "city"],
          ["Price range", "priceRange"]
        ].map(([label, key]) => (
          <label key={key} className="block">
            <span className="mb-2 block text-sm text-slate-300">{label}</span>
            <input
              value={form[key]}
              onChange={(event) =>
                setForm((current) => ({ ...current, [key]: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-white"
            />
          </label>
        ))}
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-slate-300">Genres</span>
          <input
            value={form.genres}
            onChange={(event) =>
              setForm((current) => ({ ...current, genres: event.target.value }))
            }
            className="w-full rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-white"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-slate-300">Bio</span>
          <textarea
            rows="5"
            value={form.bio}
            onChange={(event) =>
              setForm((current) => ({ ...current, bio: event.target.value }))
            }
            className="w-full rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-white"
          />
        </label>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-2xl bg-stage-400 px-5 py-3 font-bold text-white transition hover:bg-stage-500"
          >
            Save artist profile
          </button>
          {status ? <p className="mt-3 text-sm text-slate-300">{status}</p> : null}
        </div>
      </form>
    </InfoCard>
  );
}
