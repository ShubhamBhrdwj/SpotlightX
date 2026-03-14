import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InfoCard, Pill } from "../../components/UI";
import { api } from "../../lib/api";

function renderStars(rating) {
  const rounded = Math.round(Number(rating || 0));

  return "★★★★★"
    .split("")
    .map((star, index) => (
      <span key={`${rating}-${star}-${index}`} className={index < rounded ? "text-amber-400" : "text-slate-300"}>
        {star}
      </span>
    ));
}

export function OrganiserArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    city: "all",
    genre: "all",
    availability: "all",
    rating: "all"
  });

  useEffect(() => {
    api.get("/api/artists").then(setArtists).catch(() => setArtists([]));
  }, []);

  const cities = ["all", ...new Set(artists.map((artist) => artist.profile?.city).filter(Boolean))];
  const genres = [
    "all",
    ...new Set(
      artists.flatMap((artist) => artist.profile?.genres || []).filter(Boolean)
    )
  ];

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch = !filters.search || artist.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCity = filters.city === "all" || artist.profile?.city === filters.city;
    const matchesGenre = filters.genre === "all" || (artist.profile?.genres || []).includes(filters.genre);
    const matchesAvailability =
      filters.availability === "all" ||
      (filters.availability === "open" && artist.profile?.openForWork) ||
      (filters.availability === "busy" && !artist.profile?.openForWork);
    const matchesRating =
      filters.rating === "all" ||
      Number(artist.profile?.rating || 0) >= Number(filters.rating);

    return (
      matchesSearch &&
      matchesCity &&
      matchesGenre &&
      matchesAvailability &&
      matchesRating
    );
  });

  return (
    <InfoCard
      title="Browse artists"
      description="Discover available artists by city, genre, and status."
    >
      <div className="mt-6 grid gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-4 md:grid-cols-5">
        <input
          value={filters.search}
          onChange={(event) =>
            setFilters((current) => ({ ...current, search: event.target.value }))
          }
          placeholder="Search artist"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
        />
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
          value={filters.availability}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              availability: event.target.value
            }))
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
        >
          <option value="all">Any availability</option>
          <option value="open">Open for work</option>
          <option value="busy">Busy</option>
        </select>
        <select
          value={filters.rating}
          onChange={(event) =>
            setFilters((current) => ({ ...current, rating: event.target.value }))
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
        >
          <option value="all">Any rating</option>
          <option value="4">4.0+</option>
          <option value="4.5">4.5+</option>
          <option value="4.8">4.8+</option>
        </select>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {filteredArtists.map((artist) => (
          <div
            key={artist._id}
            className="motion-card group overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50"
          >
            <img
              src={artist.profile?.coverImage || "/demo/artists/artist-singer.svg"}
              alt={artist.name}
              className="h-48 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />
            <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-slate-900">{artist.name}</p>
                  <p className="text-sm text-slate-600">
                    {artist.profile?.city || "Unknown city"}
                  </p>
                </div>
                <Pill tone="mint">{artist.verification?.status || "pending"}</Pill>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {artist.profile?.headline || artist.profile?.bio || "Profile details coming soon."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(artist.profile?.genres || []).slice(0, 3).map((genre) => (
                  <Pill key={`${artist._id}-${genre}`}>{genre}</Pill>
                ))}
                {artist.profile?.priceRange ? <Pill>{artist.profile.priceRange}</Pill> : null}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>{renderStars(artist.profile?.rating || 4.7)}</span>
                    <span>{artist.profile?.rating || "4.7"}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  {artist.profile?.openForWork ? "Open for work" : "Busy"}
                </div>
              </div>

              <Link
                to={`/organiser/artists/${artist._id}`}
                className="motion-button mt-5 inline-flex rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-white"
              >
                Open profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!filteredArtists.length ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-sm text-slate-500">
          No artists match these filters yet.
        </div>
      ) : null}
    </InfoCard>
  );
}
