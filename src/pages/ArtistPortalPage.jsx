import { eventListings, sponsorDeals } from "../data/mockData";
import { PortalShell } from "../components/PortalShell";
import { InfoCard, Pill } from "../components/UI";

export function ArtistPortalPage() {
  return (
    <PortalShell
      eyebrow="Artist portal"
      title="Artist dashboard for discovery, applications, and sponsorship."
      description="Artists can manage profiles, browse nearby events, track applications, upload proofs, and receive sponsor alerts."
      sidebarTitle="Artist modules"
      sidebarItems={[
        "Dashboard overview",
        "Profile management",
        "Browse events",
        "Applications",
        "Sponsorship opportunities",
        "Messaging",
        "Verification uploads"
      ]}
      stats={[
        {
          label: "Upcoming performances",
          value: "04",
          subtext: "Accepted shows across bars, campus, and expo stages"
        },
        {
          label: "Sponsor alerts",
          value: "02",
          subtext: "New brand collaboration opportunities"
        },
        {
          label: "Verification",
          value: "92%",
          subtext: "Final admin document review pending"
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <InfoCard
          title="Browse events"
          description="Filter by genre, distance, payment, audience size, and event type."
        >
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill tone="warm">Comedy</Pill>
            <Pill>Within 25 km</Pill>
            <Pill tone="mint">Rs.15k+</Pill>
            <Pill>Audience 100+</Pill>
          </div>
          <div className="mt-6 space-y-4">
            {eventListings.map((event) => (
              <div
                key={event.name}
                className="rounded-3xl border border-white/10 bg-ink-900/80 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-white">{event.name}</p>
                    <p className="text-sm text-slate-300">
                      {event.type} | {event.genre}
                    </p>
                  </div>
                  <Pill tone="warm">{event.payment}</Pill>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>{event.distance}</Pill>
                  <Pill>{event.audience}</Pill>
                  <Pill tone="mint">Apply now</Pill>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>

        <div className="space-y-6">
          <InfoCard
            title="Profile and verification"
            description="Portfolio, pricing, calendar, certifications, and past event proof live together."
          >
            <div className="mt-5 flex flex-wrap gap-2">
              <Pill>Portfolio videos</Pill>
              <Pill>Image gallery</Pill>
              <Pill>Pricing</Pill>
              <Pill>Availability</Pill>
              <Pill tone="mint">Government ID uploaded</Pill>
            </div>
          </InfoCard>

          <InfoCard
            title="Sponsorship opportunities"
            description="Artists can see sponsor-friendly gigs and direct brand collaboration offers."
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
                    <Pill tone="mint">{deal.tier}</Pill>
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
