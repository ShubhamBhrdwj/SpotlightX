import {
  findApplicationById,
  listApplicationsByArtist,
  listApplicationsByEvent,
  updateApplication
} from "../models/Application.model.js";
import {
  createMessage,
  listMessagesByApplication,
  markMessagesAsRead
} from "../models/Message.model.js";
import { createNotification } from "../models/Notification.model.js";
import { findEventById, listEvents } from "../models/Event.model.js";
import { findUserById } from "../models/User.model.js";

function formatParticipant(user) {
  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organisationName: user.organisationName || "",
    profile: {
      city: user.profile?.city || "",
      genres: user.profile?.genres || [],
      venueTypes: user.profile?.venueTypes || []
    }
  };
}

function formatEvent(event) {
  if (!event) {
    return null;
  }

  return {
    _id: event._id,
    title: event.title,
    city: event.city,
    eventType: event.eventType,
    venueName: event.venueName,
    eventDate: event.eventDate,
    paymentOffer: event.paymentOffer
  };
}

async function buildContext(application) {
  if (!application) {
    return null;
  }

  const event = await findEventById(application.event);

  if (!event) {
    return null;
  }

  const [artist, organiser] = await Promise.all([
    findUserById(application.artist),
    findUserById(event.organiser)
  ]);

  return {
    application,
    event,
    artist,
    organiser
  };
}

async function assertAccess(applicationId, user) {
  const application = await findApplicationById(applicationId);
  const context = await buildContext(application);

  if (!context) {
    return {
      status: 404,
      message: "Application not found"
    };
  }

  const isArtistOwner = context.application.artist === user._id;
  const isOrganiserOwner = context.event.organiser === user._id;

  if (!isArtistOwner && !isOrganiserOwner) {
    return {
      status: 403,
      message: "You do not have access to this application"
    };
  }

  return context;
}

async function buildConversationSummary(application, currentUserId) {
  const context = await buildContext(application);

  if (!context) {
    return null;
  }

  const messages = await listMessagesByApplication(application._id);
  const latestMessage = messages.at(-1) || null;
  const unreadCount = messages.filter(
    (message) => message.recipient === currentUserId && !message.readAt
  ).length;

  return {
    _id: application._id,
    status: application.status,
    message: application.message,
    createdAt: application.createdAt,
    updatedAt: latestMessage?.createdAt || application.updatedAt,
    unreadCount,
    event: formatEvent(context.event),
    artist: formatParticipant(context.artist),
    organiser: formatParticipant(context.organiser),
    latestMessage: latestMessage
      ? {
          body: latestMessage.body,
          createdAt: latestMessage.createdAt,
          sender: latestMessage.sender,
          senderName:
            latestMessage.sender === context.artist?._id
              ? context.artist?.name
              : context.organiser?.organisationName || context.organiser?.name
        }
      : null
  };
}

export async function listInbox(req, res) {
  try {
    const applications =
      req.user.role === "artist"
        ? await listApplicationsByArtist(req.user._id)
        : (
            await Promise.all(
              (
                await listEvents({ organiser: req.user._id })
              ).map((event) => listApplicationsByEvent(event._id))
            )
          ).flat();

    const conversations = (
      await Promise.all(
        applications.map((application) =>
          buildConversationSummary(application, req.user._id)
        )
      )
    )
      .filter(Boolean)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

    return res.json(conversations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getThread(req, res) {
  try {
    const context = await assertAccess(req.params.id, req.user);

    if (context.status) {
      return res.status(context.status).json({ message: context.message });
    }

    await markMessagesAsRead(context.application._id, req.user._id);
    const messages = await listMessagesByApplication(context.application._id);

    return res.json({
      application: {
        _id: context.application._id,
        status: context.application.status,
        message: context.application.message,
        createdAt: context.application.createdAt,
        updatedAt: context.application.updatedAt,
        event: formatEvent(context.event),
        artist: formatParticipant(context.artist),
        organiser: formatParticipant(context.organiser)
      },
      messages: messages.map((message) => ({
        _id: message._id,
        body: message.body,
        createdAt: message.createdAt,
        readAt: message.readAt,
        sender: {
          _id: message.sender,
          name:
            message.sender === context.artist?._id
              ? context.artist?.name
              : context.organiser?.organisationName || context.organiser?.name,
          role:
            message.sender === context.artist?._id
              ? context.artist?.role
              : context.organiser?.role
        }
      }))
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function sendMessage(req, res) {
  try {
    const body = req.body.body?.trim();

    if (!body) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const context = await assertAccess(req.params.id, req.user);

    if (context.status) {
      return res.status(context.status).json({ message: context.message });
    }

    const recipient =
      req.user._id === context.artist?._id ? context.organiser : context.artist;

    const message = await createMessage({
      application: context.application._id,
      sender: req.user._id,
      recipient: recipient._id,
      body
    });

    await updateApplication(context.application._id, {});

    await createNotification({
      user: recipient._id,
      type: "message",
      title: `New message for ${context.event.title}`,
      body,
      link: recipient.role === "artist" ? "/artist/inbox" : "/organiser/inbox",
      meta: {
        applicationId: context.application._id,
        eventId: context.event._id
      }
    });

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateStatus(req, res) {
  try {
    const nextStatus = req.body.status;
    const allowedStatuses = ["applied", "shortlisted", "accepted", "rejected"];

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const context = await assertAccess(req.params.id, req.user);

    if (context.status) {
      return res.status(context.status).json({ message: context.message });
    }

    if (context.event.organiser !== req.user._id) {
      return res.status(403).json({ message: "Only organizers can update status" });
    }

    const application = await updateApplication(context.application._id, {
      status: nextStatus
    });

    await createNotification({
      user: context.artist._id,
      type: "application-status",
      title: `${context.event.title} updated your application`,
      body: `Status changed to ${nextStatus}.`,
      link: "/artist/inbox",
      meta: {
        applicationId: context.application._id,
        status: nextStatus
      }
    });

    return res.json(application);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
