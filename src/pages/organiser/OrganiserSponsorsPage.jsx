import { useEffect, useState } from "react";
import { InfoCard, Pill } from "../../components/UI";
import { api } from "../../lib/api";

export function OrganiserSponsorsPage() {
  const [marketplace, setMarketplace] = useState({ artists: [], events: [] });
  const [form, setForm] = useState({
    targetType: "event",
    targetEvent: "",
    targetArtist: "",
    tier: "Gold",
    amount: "",
    sponsorAsset: "",
    notes: ""
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/api/sponsors/browse").then(setMarketplace).catch(() => {
      setMarketplace({ artists: [], events: [] });
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Saving sponsorship...");

    try {
      await api.post("/api/sponsors/apply", {
        targetType: form.targetType,
        targetEvent: form.targetType === "event" ? form.targetEvent : null,
        targetArtist: form.targetType === "artist" ? form.targetArtist : null,
        tier: form.tier,
        amount: Number(form.amount || 0),
        sponsorAsset: form.sponsorAsset,
        notes: form.notes
      });

      setStatus(
        form.targetType === "artist"
          ? "Sponsorship proposal saved. The artist has been notified in the inbox."
          : "Sponsorship proposal saved."
      );
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <InfoCard
        title="Sponsor marketplace"
        description="Explore events and artists open to sponsorship deals."
      >
        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stage-300">
              Events
            </p>
            <div className="mt-3 space-y-3">
              {marketplace.events.map((event) => (
                <div
                  key={event._id}
                  className="rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3"
                >
                  <p className="font-semibold text-white">{event.title}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {event.city} | {event.organiser?.organisationName || "Organizer"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-mint-300">
              Artists
            </p>
            <div className="mt-3 space-y-3">
              {marketplace.artists.map((artist) => (
                <div
                  key={artist._id}
                  className="rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3"
                >
                  <p className="font-semibold text-white">{artist.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(artist.sponsorshipTiers || []).map((tier) => (
                      <Pill key={`${artist._id}-${tier.name}`}>
                        {tier.name} Rs.{tier.amount}
                      </Pill>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        title="Create sponsorship proposal"
        description="Set the target, tier, and deliverables for your proposal."
      >
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Target type</span>
            <select
              value={form.targetType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  targetType: event.target.value
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-white"
            >
              <option value="event">Event</option>
              <option value="artist">Artist</option>
            </select>
          </label>

          {form.targetType === "event" ? (
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Event</span>
              <select
                value={form.targetEvent}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    targetEvent: event.target.value
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-white"
              >
                <option value="">Select event</option>
                {marketplace.events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Artist</span>
              <select
                value={form.targetArtist}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    targetArtist: event.target.value
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-white"
              >
                <option value="">Select artist</option>
                {marketplace.artists.map((artist) => (
                  <option key={artist._id} value={artist._id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {[
            ["Tier", "tier"],
            ["Amount", "amount"],
            ["Sponsor asset", "sponsorAsset"]
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

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Notes</span>
            <textarea
              rows="4"
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-white"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-stage-400 px-5 py-3 font-bold text-white transition hover:bg-stage-500"
          >
            Save sponsorship
          </button>
          {status ? <p className="text-sm text-slate-300">{status}</p> : null}
        </form>
      </InfoCard>
    </div>
  );
}
