import { artistListings, sponsorDeals } from "../data/mockData";
import { PortalShell } from "../components/PortalShell";
import { InfoCard, Pill } from "../components/UI";

export function OrganiserPortalPage() {
  return (
    <PortalShell
      eyebrow="Organizer portal"
      title="Organizer dashboard for talent hiring, event management, and sponsor mode."
      description="Organizers can create verified event listings, browse artists, review applications, and open sponsorship deals."
      sidebarTitle="Organizer modules"
      sidebarItems={[
        "Dashboard overview",
        "Profile management",
        "Browse artists",
        "Event management",
        "Event verification ticket",
        "Sponsor mode",
        "Messaging"
      ]}
      stats={[
        {
          label: "Live event listings",
          value: "07",
          subtext: "Across weddings, bar nights, and campus activations"
        },
        {
          label: "Artist applications",
          value: "31",
          subtext: "Awaiting shortlist and review"
        },
        {
          label: "Sponsor deals",
          value: "05",
          subtext: "Active brand conversations in the marketplace"
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <InfoCard
          title="Browse artists"
          description="Filter by genre, price, rating, location, and who is open for work right now."
        >
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill tone="warm">Genre</Pill>
            <Pill>Price</Pill>
            <Pill>Rating</Pill>
            <Pill tone="mint">Open for work</Pill>
          </div>
          <div className="mt-6 space-y-4">
            {artistListings.map((artist) => (
              <div
                key={artist.name}
                className="rounded-3xl border border-white/10 bg-ink-900/80 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-white">{artist.name}</p>
                    <p className="text-sm text-slate-300">
                      {artist.genre} | {artist.location}
                    </p>
                  </div>
                  <Pill tone="mint">{artist.status}</Pill>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>{artist.price}</Pill>
                  <Pill>{artist.rating} rating</Pill>
                  <Pill tone="warm">Invite</Pill>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>

        <div className="space-y-6">
          <InfoCard
            title="Create and verify events"
            description="Before publishing, events can go through a ticket system for GST, trade license, organizer ID, and geo-tagged proof."
          >
            <div className="mt-5 flex flex-wrap gap-2">
              <Pill>Event details</Pill>
              <Pill>Artist requirements</Pill>
              <Pill>Budget</Pill>
              <Pill>Media upload</Pill>
              <Pill tone="mint">Verification ticket</Pill>
            </div>
          </InfoCard>

          <InfoCard
            title="Sponsor mode"
            description="Organizers can sponsor artists or external events with custom Bronze, Silver, and Gold tiers."
          >
            <div className="mt-5 space-y-4">
              {sponsorDeals.map((deal) => (
                <div
                  key={deal.target}
                  className="rounded-3xl border border-white/10 bg-ink-900/80 p-4"
                >
                  <p className="font-semibold text-white">{deal.target}</p>
                  <p className="mt-1 text-sm text-slate-300">{deal.returnValue}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Pill tone="warm">{deal.tier}</Pill>
                    <Pill>{deal.amount}</Pill>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>
    </PortalShell>
  );
}
