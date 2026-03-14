import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { InfoCard, Pill } from "../../components/UI";
import { api } from "../../lib/api";

export function ArtistDetailPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    api.get(`/api/artists/${id}`).then(setArtist).catch(() => setArtist(null));
  }, [id]);

  if (!artist) {
    return (
      <InfoCard title="Artist profile" description="Loading artist information.">
        <p className="mt-6 text-sm text-slate-600">This artist profile could not be loaded.</p>
      </InfoCard>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/organiser/artists"
        className="motion-button inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
      >
        Back to artists
      </Link>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-panel">
        <img
          src={artist.profile?.coverImage || "/demo/artists/artist-singer.svg"}
          alt={artist.name}
          className="h-72 w-full object-cover"
        />
        <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="mint">{artist.verification?.status || "pending"}</Pill>
              {artist.profile?.openForWork ? <Pill>Open for work</Pill> : null}
              {artist.profile?.priceRange ? <Pill tone="warm">{artist.profile.priceRange}</Pill> : null}
            </div>
            <h1 className="mt-4 text-4xl font-black text-slate-900">{artist.name}</h1>
            <p className="mt-3 text-base text-slate-600">
              {artist.profile?.headline || artist.profile?.city || "Artist profile"}
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {artist.profile?.bio || "No bio has been added yet."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {(artist.profile?.genres || []).map((genre) => (
                <Pill key={genre}>{genre}</Pill>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">City</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {artist.profile?.city || "Not set"}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Rating</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {artist.profile?.rating || "4.7"}
                </p>
              </div>
            </div>

            {artist.profile?.pastEvents?.length ? (
              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Past events
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {artist.profile.pastEvents.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <InfoCard
              title="Booking snapshot"
              description="Quick details to help decide whether to invite this artist."
              className="bg-slate-50"
            >
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{artist.email}</p>
              </div>
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Certifications</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(artist.profile?.certifications || []).length ? (
                    artist.profile.certifications.map((item) => (
                      <Pill key={item}>{item}</Pill>
                    ))
                  ) : (
                    <Pill>No certifications listed</Pill>
                  )}
                </div>
              </div>
            </InfoCard>

            {artist.profile?.gallery?.length ? (
              <InfoCard title="Gallery" description="Sample portfolio visuals for this artist." className="bg-slate-50">
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {artist.profile.gallery.map((image) => (
                    <img
                      key={image}
                      src={image}
                      alt={artist.name}
                      className="h-36 w-full rounded-3xl border border-slate-200 object-cover"
                    />
                  ))}
                </div>
              </InfoCard>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
