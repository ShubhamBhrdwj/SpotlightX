import { useAuth } from "../context/AuthContext";
import { InfoCard, Pill, SectionTitle } from "../components/UI";

const artistRequirements = [
  "Government ID and identity match",
  "Past event proof, reels, or portfolio links",
  "Certificates, institute references, or recommendations",
  "Manual review before the verified badge is approved"
];

const organiserRequirements = [
  "GST proof or business registration",
  "Trade license and organizer identity details",
  "Geo-tagged venue photos or event proof",
  "Financial proof and approval review before publishing"
];

const organiserTicketChecks = [
  "GST receipts",
  "Trade license",
  "Event director or government details",
  "Geo-tagged venue media",
  "Financial proof"
];

function RoleVerificationCard({ title, description, items }) {
  return (
    <InfoCard title={title} description={description}>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
    </InfoCard>
  );
}

export function VerificationPage() {
  const { isAuthenticated, user } = useAuth();
  const isArtist = user?.role === "artist";
  const status = user?.verification?.status || "pending";
  const submittedDocs = user?.verification?.documents || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {isAuthenticated ? (
        <>
          <SectionTitle
            eyebrow="Verification"
            title={isArtist ? "Artist verification" : "Organizer verification"}
            description={
              isArtist
                ? "Review details and proof checks for your artist account."
                : "Review details and proof checks for your organizer account and listings."
            }
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <InfoCard
              title="Current status"
              description="Track your verification stage and the proofs already associated with this account."
            >
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Pill tone={status === "verified" ? "mint" : "warm"}>
                  {status}
                </Pill>
                <span className="text-sm text-slate-600">
                  Logged in as {isArtist ? "artist" : "organizer"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Account</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {user?.organisationName || user?.name}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">City</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {user?.profile?.city || "Not added yet"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-mint-400">
                  Submitted proofs
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {submittedDocs.length ? (
                    submittedDocs.map((item) => <Pill key={item}>{item}</Pill>)
                  ) : (
                    <Pill>No proofs submitted yet</Pill>
                  )}
                </div>
              </div>
            </InfoCard>

            <RoleVerificationCard
              title={isArtist ? "Artist review checklist" : "Organizer review checklist"}
              description={
                isArtist
                  ? "Your account is reviewed against the following artist proofs before approval."
                  : "Your organization is reviewed against the following business and venue proofs before approval."
              }
              items={isArtist ? artistRequirements : organiserRequirements}
            />
          </div>

          {!isArtist ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <InfoCard
                title="Event listing ticket checks"
                description="Before an event goes live, each listing is reviewed through the organizer proof ticket flow."
              >
                <div className="mt-5 flex flex-wrap gap-2">
                  {organiserTicketChecks.map((item) => (
                    <Pill key={item}>{item}</Pill>
                  ))}
                </div>
              </InfoCard>

              <InfoCard
                title="What verified unlocks"
                description="Approved organizer accounts can publish listings with more trust and clearer proof history."
              >
                <div className="mt-5 flex flex-wrap gap-2">
                  <Pill tone="mint">Verified organizer badge</Pill>
                  <Pill>Event review queue</Pill>
                  <Pill tone="warm">Manual proof checks</Pill>
                </div>
              </InfoCard>
            </div>
          ) : (
            <div className="mt-10">
              <InfoCard
                title="What verified unlocks"
                description="Approved artist accounts are easier for organizers to trust while browsing and shortlisting talent."
              >
                <div className="mt-5 flex flex-wrap gap-2">
                  <Pill tone="mint">Verified artist badge</Pill>
                  <Pill>Stronger shortlist trust</Pill>
                  <Pill tone="warm">Manual identity review</Pill>
                </div>
              </InfoCard>
            </div>
          )}
        </>
      ) : (
        <>
          <SectionTitle
            eyebrow="Verification"
            title="Manual proof checks keep every booking more reliable."
            description="Sign in to see the exact verification flow and status for your own account. Before login, here is the platform-wide overview."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <RoleVerificationCard
              title="Artist verification"
              description="Artists submit identity and performance proof before receiving a verified profile."
              items={artistRequirements}
            />
            <RoleVerificationCard
              title="Organizer verification"
              description="Organizers submit business and venue proof before listings are trusted on the marketplace."
              items={organiserRequirements}
            />
          </div>
        </>
      )}
    </div>
  );
}
