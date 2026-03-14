import { artistListings, eventListings } from "../data/mockData";
import { InfoCard, Pill, SectionTitle } from "../components/UI";

export function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Marketplace preview"
        title="Preview artists, events, and venues before login."
        description="This page gives unauthenticated visitors a taste of the exchange while pushing verified signup paths for full access."
      />

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <InfoCard
          title="Artists preview"
          description="Filters can later connect to backend search by genre, price, rating, city, and availability."
        >
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill tone="warm">Genre</Pill>
            <Pill>Price</Pill>
            <Pill>Rating</Pill>
            <Pill tone="mint">Open for work</Pill>
          </div>
          <div className="mt-6 grid gap-4">
            {artistListings.map((artist) => (
              <div
                key={artist.name}
                className="rounded-3xl border border-white/10 bg-ink-900/70 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-white">{artist.name}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {artist.genre} | {artist.location}
                    </p>
                  </div>
                  <Pill tone="mint">{artist.status}</Pill>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>{artist.price}</Pill>
                  <Pill>{artist.rating} rating</Pill>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>

        <InfoCard
          title="Events and venues preview"
          description="Artists can browse by genre fit, payment, audience size, and how close the venue is to their location."
        >
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill tone="warm">Distance</Pill>
            <Pill>Payment</Pill>
            <Pill>Audience size</Pill>
            <Pill tone="mint">Event type</Pill>
          </div>
          <div className="mt-6 grid gap-4">
            {eventListings.map((event) => (
              <div
                key={event.name}
                className="rounded-3xl border border-white/10 bg-ink-900/70 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-white">{event.name}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {event.type} | {event.genre}
                    </p>
                  </div>
                  <Pill tone="warm">{event.payment}</Pill>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>{event.distance}</Pill>
                  <Pill>{event.audience}</Pill>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      </div>
    </div>
  );
}
