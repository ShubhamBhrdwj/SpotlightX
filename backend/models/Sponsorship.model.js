import {
  COLLECTIONS,
  deleteAllDocs,
  getCollection,
  nowIso,
  toFirestoreData
} from "../utils/firestore.js";

const SPONSORSHIPS = COLLECTIONS.sponsorships;

export async function createSponsorship(payload) {
  const ref = getCollection(SPONSORSHIPS).doc();
  const timestamp = nowIso();
  const record = {
    sponsor: payload.sponsor,
    targetType: payload.targetType,
    targetArtist: payload.targetArtist || null,
    targetEvent: payload.targetEvent || null,
    tier: payload.tier,
    amount: payload.amount,
    sponsorAsset: payload.sponsorAsset || "",
    notes: payload.notes || "",
    status: payload.status || "proposed",
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

export async function deleteAllSponsorships() {
  await deleteAllDocs(SPONSORSHIPS);
}
