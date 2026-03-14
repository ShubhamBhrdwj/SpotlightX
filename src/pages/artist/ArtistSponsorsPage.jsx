import { useEffect, useState } from "react";
import { InfoCard, Pill } from "../../components/UI";
import { api } from "../../lib/api";

export function ArtistSponsorsPage() {
  const [marketplace, setMarketplace] = useState({ artists: [], events: [] });

  useEffect(() => {
    api.get("/api/sponsors/browse").then(setMarketplace).catch(() => {
      setMarketplace({ artists: [], events: [] });
    });
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <InfoCard
        title="Sponsor-open events"
        description="Events that are currently open for sponsor tie-ins."
      >
        <div className="mt-6 space-y-4">
          {marketplace.events.length ? (
            marketplace.events.map((event) => (
              <div
                key={event._id}
                className="rounded-3xl border border-white/10 bg-ink-900/80 p-4"
              >
                <p className="font-semibold text-white">{event.title}</p>
                <p className="mt-1 text-sm text-slate-300">
                  {event.city} | {event.eventType}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No sponsor-open events yet.</p>
          )}
        </div>
      </InfoCard>

      <InfoCard
        title="Sponsor-ready artists"
        description="Browse artists and sponsorship tiers available right now."
      >
        <div className="mt-6 space-y-4">
          {marketplace.artists.length ? (
            marketplace.artists.map((artist) => (
              <div
                key={artist._id}
                className="rounded-3xl border border-white/10 bg-ink-900/80 p-4"
              >
                <p className="font-semibold text-white">{artist.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(artist.sponsorshipTiers || []).map((tier) => (
                    <Pill key={`${artist._id}-${tier.name}`}>
                      {tier.name} Rs.{tier.amount}
                    </Pill>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No sponsor-ready artists yet.</p>
          )}
        </div>
      </InfoCard>
    </div>
  );
}
