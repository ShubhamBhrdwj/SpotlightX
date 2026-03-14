import { Router } from "express";
import {
  getThread,
  listInbox,
  sendMessage,
  updateStatus
} from "../controllers/application.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isOrganiser } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/inbox", protect, listInbox);
router.get("/:id/thread", protect, getThread);
router.post("/:id/messages", protect, sendMessage);
router.put("/:id/status", protect, isOrganiser, updateStatus);

export default router;
