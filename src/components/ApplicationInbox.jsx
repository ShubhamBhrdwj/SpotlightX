import { useEffect, useState } from "react";
import { InfoCard, Pill } from "./UI";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function statusTone(status) {
  if (status === "accepted" || status === "shortlisted") {
    return "mint";
  }

  if (status === "rejected") {
    return "warm";
  }

  return "default";
}

function notificationTone(type, readAt) {
  if (type === "sponsorship-opportunity") {
    return readAt ? "default" : "mint";
  }

  return readAt ? "default" : "warm";
}

export function ApplicationInbox({ role }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [thread, setThread] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function loadInbox() {
    const [nextConversations, nextNotifications] = await Promise.all([
      api.get("/api/applications/inbox"),
      api.get("/api/notifications")
    ]);

    setConversations(nextConversations);
    setNotifications(nextNotifications);

    if (!nextConversations.length) {
      setActiveId("");
      setThread(null);
      return;
    }

    setActiveId((current) => {
      if (current && nextConversations.some((item) => item._id === current)) {
        return current;
      }

      return nextConversations[0]._id;
    });
  }

  async function loadThread(applicationId) {
    const nextThread = await api.get(`/api/applications/${applicationId}/thread`);
    setThread(nextThread);
  }

  useEffect(() => {
    loadInbox().catch((error) => setStatus(error.message));
  }, []);

  useEffect(() => {
    if (!activeId) {
      return;
    }

    loadThread(activeId)
      .then(() => loadInbox())
      .catch((error) => setStatus(error.message));
  }, [activeId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadInbox().catch(() => {});

      if (activeId) {
        loadThread(activeId).catch(() => {});
      }
    }, 2500);

    return () => clearInterval(intervalId);
  }, [activeId]);

  async function sendMessage(event) {
    event.preventDefault();

    if (!activeId || !message.trim()) {
      return;
    }

    setStatus("Sending message...");

    try {
      await api.post(`/api/applications/${activeId}/messages`, {
        body: message
      });
      setMessage("");
      await Promise.all([loadThread(activeId), loadInbox()]);
      setStatus("Message sent.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function updateApplicationStatus(nextStatus) {
    if (!activeId) {
      return;
    }

    setStatus("Updating application...");

    try {
      await api.put(`/api/applications/${activeId}/status`, {
        status: nextStatus
      });
      await Promise.all([loadThread(activeId), loadInbox()]);
      setStatus(`Application marked as ${nextStatus}.`);
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function markAllRead() {
    setStatus("Updating notifications...");

    try {
      await api.post("/api/notifications/read-all", {});
      await loadInbox();
      setStatus("Notifications marked as read.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  const activeConversation = conversations.find((item) => item._id === activeId) || null;
  const unreadNotifications = notifications.filter((item) => !item.readAt);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <InfoCard
        title="Inbox"
        description="Follow applications, open message threads, and keep replies moving."
      >
        <div className="mt-6 space-y-3">
          {conversations.length ? (
            conversations.map((conversation) => {
              const counterparty =
                role === "artist" ? conversation.organiser : conversation.artist;

              return (
                <button
                  key={conversation._id}
                  type="button"
                  onClick={() => setActiveId(conversation._id)}
                  className={[
                    "w-full rounded-3xl border p-4 text-left transition",
                    activeId === conversation._id
                      ? "border-mint-300/40 bg-mint-400/10"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {role === "artist"
                          ? counterparty?.organisationName || counterparty?.name
                          : counterparty?.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {conversation.event?.title}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Pill tone={statusTone(conversation.status)}>
                        {conversation.status}
                      </Pill>
                      {conversation.unreadCount ? (
                        <span className="rounded-full bg-mint-400 px-2 py-1 text-[11px] font-bold text-white">
                          {conversation.unreadCount} new
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                    {conversation.latestMessage?.body ||
                      "Conversation opens once an application is sent."}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {formatDate(conversation.updatedAt)}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-sm text-slate-500">
              No conversations yet. Create one by applying to an event or receiving an
              application.
            </div>
          )}
        </div>
      </InfoCard>

      <div className="space-y-6">
        <InfoCard
          title="Notifications"
          description="Recent activity tied to your applications and replies."
        >
          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              {unreadNotifications.length} unread notification
              {unreadNotifications.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={markAllRead}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Mark all read
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {notifications.length ? (
              notifications.slice(0, 6).map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => {
                    if (notification.meta?.applicationId) {
                      setActiveId(notification.meta.applicationId);
                    }
                  }}
                  className={[
                    "w-full rounded-2xl border px-4 py-3 text-left transition",
                    notification.type === "sponsorship-opportunity"
                      ? notification.readAt
                        ? "border-slate-200 bg-slate-50"
                        : "border-mint-300/30 bg-mint-400/10"
                      : notification.readAt
                        ? "border-slate-200 bg-slate-50"
                        : "border-stage-300/30 bg-stage-400/10"
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{notification.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{notification.body}</p>
                    </div>
                    {!notification.readAt ? (
                      <Pill tone={notificationTone(notification.type, notification.readAt)}>
                        {notification.type === "sponsorship-opportunity"
                          ? "sponsor"
                          : "new"}
                      </Pill>
                    ) : null}
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {formatDate(notification.createdAt)}
                  </p>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">No notifications yet.</p>
            )}
          </div>
        </InfoCard>

        <InfoCard
          title={activeConversation ? activeConversation.event?.title : "Conversation"}
          description={
            activeConversation
              ? role === "artist"
                ? `Chat with ${
                    activeConversation.organiser?.organisationName ||
                    activeConversation.organiser?.name
                  } about this booking.`
                : `Chat with ${activeConversation.artist?.name} about this application.`
              : "Select a conversation to start chatting."
          }
        >
          {thread ? (
            <>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Pill tone={statusTone(thread.application.status)}>
                  {thread.application.status}
                </Pill>
                <span className="text-sm text-slate-500">
                  {thread.application.event?.city} | {thread.application.event?.venueName}
                </span>
              </div>

              {role === "organiser" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {["shortlisted", "accepted", "rejected"].map((entry) => (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => updateApplicationStatus(entry)}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Mark {entry}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {thread.messages.length ? (
                  thread.messages.map((entry) => {
                    const ownMessage = entry.sender._id === user?._id;

                    return (
                      <div
                        key={entry._id}
                        className={[
                          "max-w-[85%] rounded-3xl px-4 py-3",
                          ownMessage
                            ? "ml-auto bg-mint-400 text-white"
                            : "border border-slate-200 bg-slate-50 text-slate-800"
                        ].join(" ")}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
                          {ownMessage ? "You" : entry.sender.name}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                          {entry.body}
                        </p>
                        <p className="mt-3 text-[11px] uppercase tracking-[0.16em] opacity-60">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">No messages yet.</p>
                )}
              </div>

              <form className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={sendMessage}>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Write a message"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-mint-400 px-5 py-3 font-bold text-white transition hover:bg-mint-500"
                >
                  Send message
                </button>
              </form>
            </>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-4 py-12 text-sm text-slate-500">
              Select a conversation from the inbox to view messages.
            </div>
          )}

          {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
        </InfoCard>
      </div>
    </div>
  );
}
