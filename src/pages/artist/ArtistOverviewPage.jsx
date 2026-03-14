import { useEffect, useState } from "react";
import { InfoCard, Pill } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

export function ArtistOverviewPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api
      .get("/api/events/my-applications/list")
      .then(setApplications)
      .catch(() => setApplications([]));
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <InfoCard
        title="Artist summary"
        description="A quick view of your account and current activity."
      >
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Name</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{user?.name}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{user?.email}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Genres</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(user?.profile?.genres || []).length ? (
                user.profile.genres.map((genre) => <Pill key={genre}>{genre}</Pill>)
              ) : (
                <Pill>No genres yet</Pill>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Applications</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{applications.length}</p>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        title="Recent applications"
        description="Applications you submit are stored and listed here."
      >
        <div className="mt-6 space-y-3">
          {applications.length ? (
            applications.slice(0, 4).map((application) => (
              <div
                key={application._id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="font-semibold text-slate-900">
                  {application.event?.title || "Deleted event"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {application.event?.city || "Unknown city"} | {application.status}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
              No applications yet. Use Browse Events to apply.
            </div>
          )}
        </div>
      </InfoCard>
    </div>
  );
}
