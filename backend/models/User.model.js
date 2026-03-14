import {
  COLLECTIONS,
  deleteAllDocs,
  docToData,
  getAllDocs,
  getCollection,
  nowIso,
  toFirestoreData
} from "../utils/firestore.js";

const USERS = COLLECTIONS.users;

function defaultProfile() {
  return {
    bio: "",
    city: "",
    genres: [],
    priceRange: "",
    rating: 0,
    openForWork: true,
    portfolio: [],
    venueTypes: [],
    availability: [],
    certifications: []
  };
}

function defaultVerification() {
  return {
    status: "unverified",
    documents: [],
    notes: ""
  };
}

export function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

export async function createUser(payload) {
  const ref = getCollection(USERS).doc();
  const timestamp = nowIso();
  const record = {
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: payload.password,
    role: payload.role,
    organisationName: payload.organisationName || "",
    phone: payload.phone || "",
    profile: {
      ...defaultProfile(),
      ...(payload.profile || {})
    },
    verification: {
      ...defaultVerification(),
      ...(payload.verification || {})
    },
    sponsorModeEnabled: payload.sponsorModeEnabled || false,
    sponsorshipTiers: payload.sponsorshipTiers || [],
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

export async function findUserById(id) {
  if (!id) {
    return null;
  }

  const snapshot = await getCollection(USERS).doc(id).get();
  return docToData(snapshot);
}

export async function findUserByEmail(email) {
  const normalizedEmail = email.toLowerCase();
  const users = await getAllDocs(USERS);
  return users.find((user) => user.email === normalizedEmail) || null;
}

export async function listUsers(filters = {}) {
  const users = await getAllDocs(USERS);

  return users.filter((user) => {
    if (filters.role && user.role !== filters.role) {
      return false;
    }

    if (
      filters.city &&
      user.profile?.city?.toLowerCase() !== filters.city.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.genre &&
      !(user.profile?.genres || []).some(
        (genre) => genre.toLowerCase() === filters.genre.toLowerCase()
      )
    ) {
      return false;
    }

    if (
      typeof filters.openForWork === "boolean" &&
      Boolean(user.profile?.openForWork) !== filters.openForWork
    ) {
      return false;
    }

    if (
      typeof filters.sponsorModeEnabled === "boolean" &&
      Boolean(user.sponsorModeEnabled) !== filters.sponsorModeEnabled
    ) {
      return false;
    }

    return true;
  });
}

export async function updateUser(id, updates) {
  const existingUser = await findUserById(id);

  if (!existingUser) {
    return null;
  }

  const mergedUser = {
    ...existingUser,
    ...updates,
    email: updates.email ? updates.email.toLowerCase() : existingUser.email,
    profile: {
      ...defaultProfile(),
      ...(existingUser.profile || {}),
      ...(updates.profile || {})
    },
    verification: {
      ...defaultVerification(),
      ...(existingUser.verification || {}),
      ...(updates.verification || {})
    },
    sponsorshipTiers:
      updates.sponsorshipTiers ?? existingUser.sponsorshipTiers ?? [],
    updatedAt: nowIso()
  };

  await getCollection(USERS).doc(id).set(toFirestoreData(mergedUser));

  return mergedUser;
}

export async function deleteAllUsers() {
  await deleteAllDocs(USERS);
}
