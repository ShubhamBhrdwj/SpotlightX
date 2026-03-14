import {
  COLLECTIONS,
  deleteAllDocs,
  docToData,
  getAllDocs,
  getCollection,
  nowIso,
  toFirestoreData
} from "../utils/firestore.js";

const NOTIFICATIONS = COLLECTIONS.notifications;

export async function createNotification(payload) {
  const ref = getCollection(NOTIFICATIONS).doc();
  const timestamp = nowIso();
  const record = {
    user: payload.user,
    type: payload.type || "general",
    title: payload.title,
    body: payload.body || "",
    link: payload.link || "",
    meta: payload.meta || {},
    createdAt: timestamp,
    updatedAt: timestamp,
    readAt: null
  };

  await ref.set(toFirestoreData(record));

  return {
    id: ref.id,
    _id: ref.id,
    ...record
  };
}

export async function findNotificationById(id) {
  if (!id) {
    return null;
  }

  const snapshot = await getCollection(NOTIFICATIONS).doc(id).get();
  return docToData(snapshot);
}

export async function listNotificationsByUser(userId) {
  const notifications = await getAllDocs(NOTIFICATIONS);

  return notifications
    .filter((notification) => notification.user === userId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function markNotificationRead(id) {
  const notification = await findNotificationById(id);

  if (!notification) {
    return null;
  }

  const updatedNotification = {
    ...notification,
    readAt: notification.readAt || nowIso(),
    updatedAt: nowIso()
  };

  await getCollection(NOTIFICATIONS).doc(id).set(toFirestoreData(updatedNotification));
  return updatedNotification;
}

export async function markAllNotificationsRead(userId) {
  const notifications = await listNotificationsByUser(userId);
  const unreadNotifications = notifications.filter((notification) => !notification.readAt);

  if (!unreadNotifications.length) {
    return [];
  }

  const batch = getCollection(NOTIFICATIONS).firestore.batch();
  const timestamp = nowIso();

  unreadNotifications.forEach((notification) => {
    batch.update(getCollection(NOTIFICATIONS).doc(notification._id), {
      readAt: timestamp,
      updatedAt: timestamp
    });
  });

  await batch.commit();

  return unreadNotifications.map((notification) => ({
    ...notification,
    readAt: timestamp,
    updatedAt: timestamp
  }));
}

export async function deleteAllNotifications() {
  await deleteAllDocs(NOTIFICATIONS);
}
