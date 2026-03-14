import { useEffect, useState } from "react";
import { InfoCard, Pill } from "../../components/UI";
import { api } from "../../lib/api";

export function ArtistApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api
      .get("/api/events/my-applications/list")
      .then(setApplications)
      .catch(() => setApplications([]));
  }, []);

  return (
    <InfoCard
      title="Applications"
      description="Track the events you have applied to."
    >
      <div className="mt-6 space-y-4">
        {applications.length ? (
          applications.map((application) => (
            <div
              key={application._id}
              className="rounded-3xl border border-white/10 bg-ink-900/80 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-white">
                    {application.event?.title || "Deleted event"}
                  </p>
                  <p className="text-sm text-slate-300">
                    {application.event?.city || "Unknown city"} |{" "}
                    {application.event?.eventType || "Unknown type"}
                  </p>
                </div>
                <Pill tone="mint">{application.status}</Pill>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                Offer: Rs.{application.event?.paymentOffer || 0}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-sm text-slate-400">
            No applications yet.
          </div>
        )}
      </div>
    </InfoCard>
  );
}
