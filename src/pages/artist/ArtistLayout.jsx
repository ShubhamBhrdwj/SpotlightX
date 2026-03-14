import { useAuth } from "../../context/AuthContext";
import { PortalLayout } from "../../components/PortalLayout";

export function ArtistLayout() {
  const { user } = useAuth();

  return (
    <PortalLayout
      eyebrow="Artist portal"
      title={`Welcome back, ${user?.name || "artist"}`}
      description=""
      sidebarTitle="Artist modules"
      navItems={[
        { to: "/artist", label: "Overview", end: true },
        { to: "/artist/profile", label: "Profile" },
        { to: "/artist/events", label: "Browse Events" },
        { to: "/artist/applications", label: "Applications" },
        { to: "/artist/inbox", label: "Inbox" }
      ]}
      stats={[
        {
          label: "Role",
          value: "Artist",
          subtext: "Only artist pages are unlocked for this login"
        },
        {
          label: "City",
          value: user?.profile?.city || "Not set",
          subtext: "Used to match events and venues"
        },
        {
          label: "Verification",
          value: user?.verification?.status || "pending",
          subtext: "Review status for your account"
        }
      ]}
    />
  );
}
