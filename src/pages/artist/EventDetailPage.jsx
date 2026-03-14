import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { InfoCard, Pill } from "../../components/UI";
import { api } from "../../lib/api";

export function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get(`/api/events/${id}`).then(setEvent).catch(() => setEvent(null));
  }, [id]);

  async function apply() {
    setStatus("Sending application...");

    try {
      await api.post(`/api/events/${id}/apply`, {
        message: message || "Interested in performing."
      });
      setStatus("Application sent.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  if (!event) {
    return (
      <InfoCard title="Event details" description="Loading event information.">
        <p className="mt-6 text-sm text-slate-600">This event could not be loaded.</p>
      </InfoCard>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/artist/events"
        className="motion-button inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
      >
        Back to events
      </Link>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-panel">
        <img
          src={event.coverImage || "/demo/events/festival-night.svg"}
          alt={event.title}
          className="h-72 w-full object-cover"
        />
        <div className="grid gap-6 p-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="mint">{event.verificationStatus}</Pill>
              <Pill tone="warm">Rs.{event.paymentOffer || 0}</Pill>
              <Pill>{event.eventType}</Pill>
            </div>
            <h1 className="mt-4 text-4xl font-black text-slate-900">{event.title}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">{event.description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Venue</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {event.venueName}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {event.city} | {event.venueType}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Audience and traffic</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {event.audienceSize || "TBD"} expected
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {event.footfallFrequency || "Fresh listing"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Genre fit
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(event.genreTags || []).map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
            </div>

            {event.gallery?.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {event.gallery.map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt={event.title}
                    className="h-32 w-full rounded-3xl border border-slate-200 object-cover"
                  />
                ))}
              </div>
            ) : null}
          </div>

          <InfoCard
            title="Organizer and application"
            description="Review the organizer details and send your proposal directly from this page."
            className="h-fit bg-slate-50"
          >
            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Organizer</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {event.organiser?.organisationName || event.organiser?.name}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {event.organiser?.profile?.city || event.city}
              </p>
            </div>

            <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Event date</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {event.eventDate
                  ? new Date(event.eventDate).toLocaleDateString()
                  : "Date to be announced"}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-600">
                  Message to organizer
                </span>
                <textarea
                  rows="5"
                  value={message}
                  onChange={(entry) => setMessage(entry.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                  placeholder="Share why you fit this lineup."
                />
              </label>
              <button
                type="button"
                onClick={apply}
                className="motion-button w-full rounded-2xl bg-mint-400 px-5 py-3 font-bold text-white transition hover:bg-mint-500"
              >
                Apply to this event
              </button>
              {status ? <p className="text-sm text-slate-600">{status}</p> : null}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
