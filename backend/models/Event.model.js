import {
  COLLECTIONS,
  deleteAllDocs,
  docToData,
  getAllDocs,
  getCollection,
  nowIso,
  toFirestoreData
} from "../utils/firestore.js";

const EVENTS = COLLECTIONS.events;

function defaultEvent() {
  return {
    description: "",
    city: "",
    venueName: "",
    venueType: "",
    eventType: "",
    genreTags: [],
    audienceSize: 0,
    footfallFrequency: "",
    paymentOffer: 0,
    eventDate: null,
    sponsorOpen: false,
    verificationStatus: "pending",
    proofDocuments: [],
    geoTaggedImages: []
  };
}

export async function createEvent(payload) {
  const ref = getCollection(EVENTS).doc();
  const timestamp = nowIso();
  const record = {
    ...defaultEvent(),
    ...payload,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await ref.set(toFirestoreData(record));

  return {
    id: ref.id,
    _id: ref.id,
    ...record
  };
}

export async function findEventById(id) {
  if (!id) {
    return null;
  }

  const snapshot = await getCollection(EVENTS).doc(id).get();
  return docToData(snapshot);
}

export async function listEvents(filters = {}) {
  const events = await getAllDocs(EVENTS);

  return events.filter((event) => {
    if (filters.organiser && event.organiser !== filters.organiser) {
      return false;
    }

    if (
      filters.genre &&
      !(event.genreTags || []).some(
        (genre) => genre.toLowerCase() === filters.genre.toLowerCase()
      )
    ) {
      return false;
    }

    if (
      filters.city &&
      event.city?.toLowerCase() !== filters.city.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.eventType &&
      event.eventType?.toLowerCase() !== filters.eventType.toLowerCase()
    ) {
      return false;
    }

    if (
      typeof filters.sponsorOpen === "boolean" &&
      Boolean(event.sponsorOpen) !== filters.sponsorOpen
    ) {
      return false;
    }

    return true;
  });
}

export async function updateEvent(id, updates) {
  const existingEvent = await findEventById(id);

  if (!existingEvent) {
    return null;
  }

  const mergedEvent = {
    ...defaultEvent(),
    ...existingEvent,
    ...updates,
    updatedAt: nowIso()
  };

  await getCollection(EVENTS).doc(id).set(toFirestoreData(mergedEvent));

  return mergedEvent;
}

export async function deleteEvent(id) {
  const existingEvent = await findEventById(id);

  if (!existingEvent) {
    return null;
  }

  await getCollection(EVENTS).doc(id).delete();
  return existingEvent;
}

export async function deleteAllEvents() {
  await deleteAllDocs(EVENTS);
}
