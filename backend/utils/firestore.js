import { getDb } from "../config/db.js";

export const COLLECTIONS = {
  users: "users",
  events: "events",
  applications: "applications",
  messages: "messages",
  notifications: "notifications",
  sponsorships: "sponsorships",
  sponsorshipTiers: "sponsorshipTiers"
};

export function nowIso() {
  return new Date().toISOString();
}

export function getCollection(name) {
  return getDb().collection(name);
}

export function docToData(snapshot) {
  if (!snapshot.exists) {
    return null;
  }

  return {
    id: snapshot.id,
    _id: snapshot.id,
    ...snapshot.data()
  };
}

export function toFirestoreData(value) {
  if (Array.isArray(value)) {
    return value.map((item) => toFirestoreData(item));
  }

  if (value && typeof value === "object") {
    const next = {};

    for (const [key, entry] of Object.entries(value)) {
      if (key === "id" || key === "_id" || entry === undefined) {
        continue;
      }

      next[key] = toFirestoreData(entry);
    }

    return next;
  }

  return value;
}

export async function getAllDocs(collectionName) {
  const snapshot = await getCollection(collectionName).get();
  return snapshot.docs.map((doc) => docToData(doc));
}

export async function deleteAllDocs(collectionName) {
  const snapshot = await getCollection(collectionName).get();

  if (snapshot.empty) {
    return;
  }

  const batch = getDb().batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}
