import {
  createApplication,
  listApplicationsByArtist,
  listApplicationsByEvent
} from "../models/Application.model.js";
import {
  createEvent as createEventRecord,
  deleteEvent as deleteEventRecord,
  findEventById,
  listEvents as listEventRecords,
  updateEvent as updateEventRecord
} from "../models/Event.model.js";
import { createMessage } from "../models/Message.model.js";
import { createNotification } from "../models/Notification.model.js";
import { findUserById, sanitizeUser } from "../models/User.model.js";

async function attachOrganiser(event, includeEmail = false) {
  const organiser = await findUserById(event.organiser);

  if (!organiser) {
    return {
      ...event,
      organiser: null
    };
  }

  const safeOrganiser = sanitizeUser(organiser);

  return {
    ...event,
    organiser: includeEmail
      ? {
          _id: safeOrganiser._id,
          name: safeOrganiser.name,
          organisationName: safeOrganiser.organisationName,
          email: safeOrganiser.email,
          profile: {
            city: safeOrganiser.profile?.city || ""
          },
          verification: {
            status: safeOrganiser.verification?.status || "unverified"
          }
        }
      : {
          _id: safeOrganiser._id,
          name: safeOrganiser.name,
          organisationName: safeOrganiser.organisationName,
          profile: {
            city: safeOrganiser.profile?.city || ""
          },
          verification: {
            status: safeOrganiser.verification?.status || "unverified"
          }
        }
  };
}

export async function listEvents(req, res) {
  try {
    const events = await listEventRecords({
      genre: req.query.genre,
      city: req.query.city,
      eventType: req.query.eventType
    });

    const populatedEvents = await Promise.all(
      events.map((event) => attachOrganiser(event))
    );

    return res.json(populatedEvents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getEvent(req, res) {
  try {
    const event = await findEventById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(await attachOrganiser(event, true));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createEvent(req, res) {
  try {
    const event = await createEventRecord({
      ...req.body,
      organiser: req.user._id
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateEvent(req, res) {
  try {
    const event = await findEventById(req.params.id);

    if (!event || event.organiser !== req.user._id) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedEvent = await updateEventRecord(req.params.id, req.body);
    return res.json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteEvent(req, res) {
  try {
    const event = await findEventById(req.params.id);

    if (!event || event.organiser !== req.user._id) {
      return res.status(404).json({ message: "Event not found" });
    }

    await deleteEventRecord(req.params.id);
    return res.json({ message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function applyToEvent(req, res) {
  try {
    const event = await findEventById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const application = await createApplication({
      event: req.params.id,
      artist: req.user._id,
      message: req.body.message
    });

    await createMessage({
      application: application._id,
      sender: req.user._id,
      recipient: event.organiser,
      body: application.message || "Interested in performing."
    });

    await createNotification({
      user: event.organiser,
      type: "application",
      title: `New application for ${event.title}`,
      body: `${req.user.name} applied to your event.`,
      link: "/organiser/inbox",
      meta: {
        applicationId: application._id,
        eventId: event._id
      }
    });

    return res.status(201).json(application);
  } catch (error) {
    if (error.code === "DUPLICATE_APPLICATION") {
      return res
        .status(400)
        .json({ message: "Artist has already applied to this event" });
    }

    return res.status(500).json({ message: error.message });
  }
}

export async function listApplicants(req, res) {
  try {
    const event = await findEventById(req.params.id);

    if (!event || event.organiser !== req.user._id) {
      return res.status(404).json({ message: "Event not found" });
    }

    const applicants = await listApplicationsByEvent(event._id);
    const populatedApplicants = await Promise.all(
      applicants.map(async (application) => {
        const artist = await findUserById(application.artist);

        return {
          ...application,
          artist: artist
            ? {
                _id: artist._id,
                name: artist.name,
                email: artist.email,
                profile: {
                  city: artist.profile?.city || "",
                  genres: artist.profile?.genres || []
                }
              }
            : null
        };
      })
    );

    return res.json(populatedApplicants);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function listMyEvents(req, res) {
  try {
    const events = await listEventRecords({
      organiser: req.user._id
    });

    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function listMyApplications(req, res) {
  try {
    const applications = await listApplicationsByArtist(req.user._id);
    const enriched = await Promise.all(
      applications.map(async (application) => {
        const event = await findEventById(application.event);
        return {
          ...application,
          event: event
            ? {
                _id: event._id,
                title: event.title,
                city: event.city,
                eventType: event.eventType,
                paymentOffer: event.paymentOffer,
                eventDate: event.eventDate
              }
            : null
        };
      })
    );

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
