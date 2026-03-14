import { findEventById, listEvents } from "../models/Event.model.js";
import { createNotification } from "../models/Notification.model.js";
import { createSponsorship } from "../models/Sponsorship.model.js";
import { createSponsorshipTier } from "../models/SponsorshipTier.model.js";
import { findUserById, listUsers, sanitizeUser } from "../models/User.model.js";

export async function browseSponsorMarketplace(req, res) {
  try {
    const artists = await listUsers({
      role: "artist",
      sponsorModeEnabled: true
    });

    const events = await listEvents({ sponsorOpen: true });
    const populatedEvents = await Promise.all(
      events.map(async (event) => {
        const organiser = await findUserById(event.organiser);

        return {
          ...event,
          organiser: organiser
            ? {
                _id: organiser._id,
                name: organiser.name,
                organisationName: organiser.organisationName
              }
            : null
        };
      })
    );

    return res.json({
      artists: artists.map((artist) => sanitizeUser(artist)),
      events: populatedEvents
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createSponsorTier(req, res) {
  try {
    const tier = await createSponsorshipTier(req.body);
    return res.status(201).json(tier);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function applyForSponsorship(req, res) {
  try {
    if (req.body.targetType === "artist" && !req.body.targetArtist) {
      return res.status(400).json({ message: "Artist target is required" });
    }

    if (req.body.targetType === "event" && !req.body.targetEvent) {
      return res.status(400).json({ message: "Event target is required" });
    }

    const sponsorship = await createSponsorship({
      sponsor: req.user._id,
      ...req.body
    });

    const sponsorName = req.user.organisationName || req.user.name;

    if (sponsorship.targetType === "artist" && sponsorship.targetArtist) {
      const artist = await findUserById(sponsorship.targetArtist);

      if (!artist || artist.role !== "artist") {
        return res.status(404).json({ message: "Artist not found" });
      }

      await createNotification({
        user: artist._id,
        type: "sponsorship-opportunity",
        title: `${sponsorName} sent you a sponsorship opportunity`,
        body: `${sponsorship.tier} tier for Rs.${sponsorship.amount} with ${sponsorship.sponsorAsset || "brand placement"}${sponsorship.notes ? `: ${sponsorship.notes}` : "."}`,
        link: "/artist/inbox",
        meta: {
          sponsorshipId: sponsorship._id,
          sponsorId: req.user._id,
          tier: sponsorship.tier,
          amount: sponsorship.amount
        }
      });
    }

    if (sponsorship.targetType === "event" && sponsorship.targetEvent) {
      const event = await findEventById(sponsorship.targetEvent);

      if (event?.organiser) {
        await createNotification({
          user: event.organiser,
          type: "sponsorship-opportunity",
          title: `${sponsorName} wants to sponsor ${event.title}`,
          body: `${sponsorship.tier} tier for Rs.${sponsorship.amount}${sponsorship.notes ? `: ${sponsorship.notes}` : "."}`,
          link: "/organiser/inbox",
          meta: {
            sponsorshipId: sponsorship._id,
            eventId: event._id,
            sponsorId: req.user._id
          }
        });
      }
    }

    return res.status(201).json(sponsorship);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
