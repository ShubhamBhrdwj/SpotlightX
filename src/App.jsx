import { Navigate, Route, Routes } from "react-router-dom";
import { TopNav } from "./components/TopNav";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";
import { AuthPage } from "./pages/AuthPage";
import { ExplorePage } from "./pages/ExplorePage";
import { VerificationPage } from "./pages/VerificationPage";
import { ArtistLayout } from "./pages/artist/ArtistLayout";
import { ArtistApplicationsPage } from "./pages/artist/ArtistApplicationsPage";
import { EventDetailPage } from "./pages/artist/EventDetailPage";
import { ArtistEventsPage } from "./pages/artist/ArtistEventsPage";
import { ArtistInboxPage } from "./pages/artist/ArtistInboxPage";
import { ArtistOverviewPage } from "./pages/artist/ArtistOverviewPage";
import { ArtistProfilePage } from "./pages/artist/ArtistProfilePage";
import { ArtistDetailPage } from "./pages/organiser/ArtistDetailPage";
import { OrganiserArtistsPage } from "./pages/organiser/OrganiserArtistsPage";
import { OrganiserEventsPage } from "./pages/organiser/OrganiserEventsPage";
import { OrganiserInboxPage } from "./pages/organiser/OrganiserInboxPage";
import { OrganiserLayout } from "./pages/organiser/OrganiserLayout";
import { OrganiserOverviewPage } from "./pages/organiser/OrganiserOverviewPage";
import { OrganiserProfilePage } from "./pages/organiser/OrganiserProfilePage";
import { OrganiserSponsorsPage } from "./pages/organiser/OrganiserSponsorsPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNav />
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/verification" element={<VerificationPage />} />

        <Route element={<ProtectedRoute role="artist" />}>
          <Route path="/artist" element={<ArtistLayout />}>
            <Route index element={<ArtistOverviewPage />} />
            <Route path="profile" element={<ArtistProfilePage />} />
            <Route path="events" element={<ArtistEventsPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="applications" element={<ArtistApplicationsPage />} />
            <Route path="inbox" element={<ArtistInboxPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="organiser" />}>
          <Route path="/organiser" element={<OrganiserLayout />}>
            <Route index element={<OrganiserOverviewPage />} />
            <Route path="profile" element={<OrganiserProfilePage />} />
            <Route path="artists" element={<OrganiserArtistsPage />} />
            <Route path="artists/:id" element={<ArtistDetailPage />} />
            <Route path="events" element={<OrganiserEventsPage />} />
            <Route path="inbox" element={<OrganiserInboxPage />} />
            <Route path="sponsors" element={<OrganiserSponsorsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
