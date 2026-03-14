import { useEffect, useState } from "react";
import { InfoCard, Pill } from "../../components/UI";
import { api } from "../../lib/api";

const emptyForm = {
  title: "",
  description: "",
  city: "",
  venueName: "",
  venueType: "",
  eventType: "",
  genreTags: "",
  audienceSize: "",
  paymentOffer: "",
  eventDate: ""
};

export function OrganiserEventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [applicantsByEvent, setApplicantsByEvent] = useState({});

  function loadEvents() {
    api.get("/api/events/mine/list").then(setEvents).catch(() => setEvents([]));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setStatus("Creating event...");

    try {
      await api.post("/api/events", {
        title: form.title,
        description: form.description,
        city: form.city,
        venueName: form.venueName,
        venueType: form.venueType,
        eventType: form.eventType,
        genreTags: form.genreTags
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean),
        audienceSize: Number(form.audienceSize || 0),
        paymentOffer: Number(form.paymentOffer || 0),
        eventDate: form.eventDate,
        sponsorOpen: true,
        verificationStatus: "pending"
      });

      setForm(emptyForm);
      setStatus("Event created and saved.");
      loadEvents();
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function loadApplicants(eventId) {
    try {
      const applicants = await api.get(`/api/events/${eventId}/applicants`);
      setApplicantsByEvent((current) => ({ ...current, [eventId]: applicants }));
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <InfoCard
        title="Create event"
        description="Publish a new event and start receiving applications."
      >
        <form className="mt-6 space-y-4" onSubmit={handleCreate}>
          {[
            ["Event title", "title"],
            ["City", "city"],
            ["Venue name", "venueName"],
            ["Venue type", "venueType"],
            ["Event type", "eventType"],
            ["Genres", "genreTags"],
            ["Audience size", "audienceSize"],
            ["Payment offer", "paymentOffer"],
            ["Event date", "eventDate"]
          ].map(([label, key]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm text-slate-300">{label}</span>
              <input
                type={key === "eventDate" ? "date" : "text"}
                value={form[key]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [key]: event.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-white"
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Description</span>
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-white"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl bg-stage-400 px-5 py-3 font-bold text-white transition hover:bg-stage-500"
          >
            Save event
          </button>
          {status ? <p className="text-sm text-slate-300">{status}</p> : null}
        </form>
      </InfoCard>

      <InfoCard
        title="Manage events"
        description="Load applicants for each event post."
      >
        <div className="mt-6 space-y-4">
          {events.length ? (
            events.map((event) => (
              <div
                key={event._id}
                className="rounded-3xl border border-white/10 bg-ink-900/80 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-white">{event.title}</p>
                    <p className="text-sm text-slate-300">
                      {event.city} | {event.eventType} | {event.venueName}
                    </p>
                  </div>
                  <Pill tone="mint">{event.verificationStatus}</Pill>
                </div>
                <button
                  type="button"
                  onClick={() => loadApplicants(event._id)}
                  className="mt-4 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Load applicants
                </button>
                {applicantsByEvent[event._id]?.length ? (
                  <div className="mt-4 space-y-2">
                    {applicantsByEvent[event._id].map((application) => (
                      <div
                        key={application._id}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                      >
                        <p className="font-semibold text-white">
                          {application.artist?.name || "Unknown artist"}
                        </p>
                        <p className="text-sm text-slate-300">
                          {application.artist?.email || "No email"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-sm text-slate-400">
              No events yet.
            </div>
          )}
        </div>
      </InfoCard>
    </div>
  );
}
