import {
  COLLECTIONS,
  deleteAllDocs,
  docToData,
  getAllDocs,
  getCollection,
  nowIso,
  toFirestoreData
} from "../utils/firestore.js";

const APPLICATIONS = COLLECTIONS.applications;

export async function findApplicationByEventAndArtist(eventId, artistId) {
  const applications = await getAllDocs(APPLICATIONS);
  return (
    applications.find(
      (application) =>
        application.event === eventId && application.artist === artistId
    ) || null
  );
}

export async function findApplicationById(id) {
  if (!id) {
    return null;
  }

  const snapshot = await getCollection(APPLICATIONS).doc(id).get();
  return docToData(snapshot);
}

export async function createApplication(payload) {
  const existingApplication = await findApplicationByEventAndArtist(
    payload.event,
    payload.artist
  );

  if (existingApplication) {
    const error = new Error("Artist has already applied to this event");
    error.code = "DUPLICATE_APPLICATION";
    throw error;
  }

  const ref = getCollection(APPLICATIONS).doc();
  const timestamp = nowIso();
  const record = {
    event: payload.event,
    artist: payload.artist,
    message: payload.message || "",
    status: payload.status || "applied",
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

export async function listApplicationsByEvent(eventId) {
  const applications = await getAllDocs(APPLICATIONS);

  return applications
    .filter((application) => application.event === eventId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function listApplicationsByArtist(artistId) {
  const applications = await getAllDocs(APPLICATIONS);

  return applications
    .filter((application) => application.artist === artistId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function updateApplication(id, updates) {
  const existingApplication = await findApplicationById(id);

  if (!existingApplication) {
    return null;
  }

  const updatedApplication = {
    ...existingApplication,
    ...updates,
    updatedAt: nowIso()
  };

  await getCollection(APPLICATIONS).doc(id).set(toFirestoreData(updatedApplication));

  return updatedApplication;
}

export async function deleteAllApplications() {
  await deleteAllDocs(APPLICATIONS);
}
