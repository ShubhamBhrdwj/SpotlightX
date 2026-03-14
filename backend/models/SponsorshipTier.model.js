import {
  COLLECTIONS,
  deleteAllDocs,
  getCollection,
  nowIso,
  toFirestoreData
} from "../utils/firestore.js";

const SPONSORSHIP_TIERS = COLLECTIONS.sponsorshipTiers;

export async function createSponsorshipTier(payload) {
  const ref = getCollection(SPONSORSHIP_TIERS).doc();
  const timestamp = nowIso();
  const record = {
    ownerType: payload.ownerType,
    artist: payload.artist || null,
    event: payload.event || null,
    name: payload.name,
    amount: payload.amount,
    benefits: payload.benefits || [],
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

export async function createManySponsorshipTiers(payloads) {
  const created = [];

  for (const payload of payloads) {
    created.push(await createSponsorshipTier(payload));
  }

  return created;
}

export async function deleteAllSponsorshipTiers() {
  await deleteAllDocs(SPONSORSHIP_TIERS);
}
