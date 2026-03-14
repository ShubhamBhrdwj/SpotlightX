import {
  COLLECTIONS,
  deleteAllDocs,
  getAllDocs,
  getCollection,
  nowIso,
  toFirestoreData
} from "../utils/firestore.js";

const MESSAGES = COLLECTIONS.messages;

export async function createMessage(payload) {
  const ref = getCollection(MESSAGES).doc();
  const timestamp = nowIso();
  const record = {
    application: payload.application,
    sender: payload.sender,
    recipient: payload.recipient,
    body: payload.body,
    createdAt: timestamp,
    updatedAt: timestamp,
    readAt: payload.readAt || null
  };

  await ref.set(toFirestoreData(record));

  return {
    id: ref.id,
    _id: ref.id,
    ...record
  };
}

export async function listMessagesByApplication(applicationId) {
  const messages = await getAllDocs(MESSAGES);

  return messages
    .filter((message) => message.application === applicationId)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export async function markMessagesAsRead(applicationId, userId) {
  const messages = await listMessagesByApplication(applicationId);
  const unreadMessages = messages.filter(
    (message) => message.recipient === userId && !message.readAt
  );

  if (!unreadMessages.length) {
    return;
  }

  const batch = getCollection(MESSAGES).firestore.batch();
  const timestamp = nowIso();

  unreadMessages.forEach((message) => {
    batch.update(getCollection(MESSAGES).doc(message._id), {
      readAt: timestamp,
      updatedAt: timestamp
    });
  });

  await batch.commit();
}

export async function deleteAllMessages() {
  await deleteAllDocs(MESSAGES);
}
