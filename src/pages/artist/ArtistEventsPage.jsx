import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InfoCard, Pill } from "../../components/UI";
import { api } from "../../lib/api";

export function ArtistEventsPage() {
  const [events, setEvents] = useState([]);
  const [messageByEvent, setMessageByEvent] = useState({});
  const [status, setStatus] = useState("");
  const [filters, setFilters] = useState({
    city: "all",
    genre: "all",
    eventType: "all",
    budget: "all"
  });

  useEffect(() => {
    api.get("/api/events").then(setEvents).catch(() => setEvents([]));
  }, []);

  async function applyToEvent(eventId) {
    setStatus("Applying...");

    try {
      await api.post(`/api/events/${eventId}/apply`, {
        message: messageByEvent[eventId] || "Interested in performing."
      });
      setStatus("Application saved.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  const cities = ["all", ...new Set(events.map((event) => event.city).filter(Boolean))];
  const genres = [
    "all",
    ...new Set(events.flatMap((event) => event.genreTags || []).filter(Boolean))
  ];
  const eventTypes = [
    "all",
    ...new Set(events.map((event) => event.eventType).filter(Boolean))
  ];

  const filteredEvents = events.filter((event) => {
    const matchesCity = filters.city === "all" || event.city === filters.city;
    const matchesGenre =
      filters.genre === "all" || (event.genreTags || []).includes(filters.genre);
    const matchesEventType =
      filters.eventType === "all" || event.eventType === filters.eventType;
    const matchesBudget =
      filters.budget === "all" ||
      (filters.budget === "under-30000" && Number(event.paymentOffer || 0) < 30000) ||
      (filters.budget === "30000-50000" &&
        Number(event.paymentOffer || 0) >= 30000 &&
        Number(event.paymentOffer || 0) <= 50000) ||
      (filters.budget === "50000-plus" && Number(event.paymentOffer || 0) > 50000);

    return matchesCity && matchesGenre && matchesEventType && matchesBudget;
  });

  return (
    <InfoCard
      title="Browse events"
      description="Explore current event opportunities and apply directly."
    >
      <div className="mt-6 grid gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
        <select
          value={filters.city}
          onChange={(event) =>
            setFilters((current) => ({ ...current, city: event.target.value }))
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city === "all" ? "All cities" : city}
            </option>
          ))}
        </select>
        <select
          value={filters.genre}
          onChange={(event) =>
            setFilters((current) => ({ ...current, genre: event.target.value }))
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === "all" ? "All genres" : genre}
            </option>
          ))}
        </select>
        <select
          value={filters.eventType}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              eventType: event.target.value
            }))
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
        >
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type === "all" ? "All event types" : type}
            </option>
          ))}
        </select>
        <select
          value={filters.budget}
          onChange={(event) =>
            setFilters((current) => ({ ...current, budget: event.target.value }))
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
        >
          <option value="all">Any budget</option>
          <option value="under-30000">Under Rs.30k</option>
          <option value="30000-50000">Rs.30k - Rs.50k</option>
          <option value="50000-plus">Rs.50k+</option>
        </select>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className="motion-card group overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50"
          >
            <img
              src={event.coverImage || "/demo/events/festival-night.svg"}
              alt={event.title}
              className="h-48 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />

            <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-slate-900">{event.title}</p>
                  <p className="text-sm text-slate-600">
                    {event.eventType} | {event.city} | {event.venueName}
                  </p>
                </div>
                <Pill tone="warm">Rs.{event.paymentOffer || 0}</Pill>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {event.description || "No description added yet."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(event.genreTags || []).slice(0, 3).map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
                <Pill tone="mint">{event.verificationStatus}</Pill>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  Audience {event.audienceSize || "TBD"}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleDateString()
                    : "Date TBA"}
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <input
                  value={messageByEvent[event._id] || ""}
                  onChange={(entry) =>
                    setMessageByEvent((current) => ({
                      ...current,
                      [event._id]: entry.target.value
                    }))
                  }
                  placeholder="Short message to organizer"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => applyToEvent(event._id)}
                  className="motion-button rounded-2xl bg-mint-400 px-5 py-3 font-bold text-white transition hover:bg-mint-500"
                >
                  Apply
                </button>
                <Link
                  to={`/artist/events/${event._id}`}
                  className="motion-button rounded-2xl border border-slate-200 px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-white"
                >
                  View details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
      {!filteredEvents.length ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-sm text-slate-500">
          No events match these filters yet.
        </div>
      ) : null}
    </InfoCard>
  );
}
