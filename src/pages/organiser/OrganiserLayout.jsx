import { useAuth } from "../../context/AuthContext";
import { PortalLayout } from "../../components/PortalLayout";

export function OrganiserLayout() {
  const { user } = useAuth();

  return (
    <PortalLayout
      eyebrow="Organizer portal"
      title={`Welcome back, ${user?.organisationName || user?.name || "organizer"}`}
      description="Manage your profile, browse artists, create events, and handle sponsorship opportunities."
      sidebarTitle="Organizer modules"
      navItems={[
        { to: "/organiser", label: "Overview", end: true },
        { to: "/organiser/profile", label: "Profile" },
        { to: "/organiser/artists", label: "Browse Artists" },
        { to: "/organiser/events", label: "Events" },
        { to: "/organiser/inbox", label: "Inbox" },
        { to: "/organiser/sponsors", label: "Sponsor Mode" }
      ]}
      stats={[
        {
          label: "Role",
          value: "Organizer",
          subtext: "Only organizer pages are unlocked for this login"
        },
        {
          label: "City",
          value: user?.profile?.city || "Not set",
          subtext: "Used for venues and event posts"
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
