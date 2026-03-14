import { useEffect, useState } from "react";
import { InfoCard, Pill } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

export function OrganiserOverviewPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/api/events/mine/list").then(setEvents).catch(() => setEvents([]));
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <InfoCard
        title="Organizer summary"
        description="A quick overview of your account and active event activity."
      >
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Contact</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{user?.name}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Organization</p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {user?.organisationName || "Not set"}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:col-span-2">
            <p className="text-sm text-slate-500">Venue types</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(user?.profile?.venueTypes || []).length ? (
                user.profile.venueTypes.map((entry) => (
                  <Pill key={entry}>{entry}</Pill>
                ))
              ) : (
                <Pill>No venue types yet</Pill>
              )}
            </div>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        title="Recent events"
        description="These are your saved event posts."
      >
        <div className="mt-6 space-y-3">
          {events.length ? (
            events.slice(0, 4).map((event) => (
              <div
                key={event._id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="font-semibold text-slate-900">{event.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {event.city} | {event.eventType}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
              No event posts yet. Create one from the Events page.
            </div>
          )}
        </div>
      </InfoCard>
    </div>
  );
}
