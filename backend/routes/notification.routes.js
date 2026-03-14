import { Router } from "express";
import {
  listMyNotifications,
  markMyNotificationsRead,
  markOneNotificationRead
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protect, listMyNotifications);
router.post("/read-all", protect, markMyNotificationsRead);
router.post("/:id/read", protect, markOneNotificationRead);

export default router;
