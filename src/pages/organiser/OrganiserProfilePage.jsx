import { useState } from "react";
import { InfoCard } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

export function OrganiserProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    organisationName: user?.organisationName || "",
    phone: user?.phone || "",
    city: user?.profile?.city || "",
    bio: user?.profile?.bio || "",
    venueTypes: (user?.profile?.venueTypes || []).join(", ")
  });
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Saving...");

    try {
      const updated = await api.put("/api/organisers/me/profile", {
        name: form.name,
        organisationName: form.organisationName,
        phone: form.phone,
        profile: {
          city: form.city,
          bio: form.bio,
          venueTypes: form.venueTypes
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean)
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
      title="Organizer profile"
      description="Update your contact details, venue types, and organization bio."
    >
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        {[
          ["Contact name", "name"],
          ["Organization name", "organisationName"],
          ["Phone", "phone"],
          ["City", "city"]
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
          <span className="mb-2 block text-sm text-slate-300">Venue types</span>
          <input
            value={form.venueTypes}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                venueTypes: event.target.value
              }))
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
            Save organizer profile
          </button>
          {status ? <p className="mt-3 text-sm text-slate-300">{status}</p> : null}
        </div>
      </form>
    </InfoCard>
  );
}
