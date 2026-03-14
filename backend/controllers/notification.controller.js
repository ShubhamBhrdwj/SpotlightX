import {
  findNotificationById,
  listNotificationsByUser,
  markAllNotificationsRead,
  markNotificationRead
} from "../models/Notification.model.js";

export async function listMyNotifications(req, res) {
  try {
    const notifications = await listNotificationsByUser(req.user._id);
    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function markOneNotificationRead(req, res) {
  try {
    const notification = await findNotificationById(req.params.id);

    if (!notification || notification.user !== req.user._id) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const updatedNotification = await markNotificationRead(notification._id);
    return res.json(updatedNotification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function markMyNotificationsRead(req, res) {
  try {
    const updatedNotifications = await markAllNotificationsRead(req.user._id);
    return res.json({
      message: "Notifications marked as read",
      count: updatedNotifications.length
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
