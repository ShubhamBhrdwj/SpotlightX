import { Router } from "express";
import {
  applyToEvent,
  createEvent,
  deleteEvent,
  getEvent,
  listApplicants,
  listEvents,
  listMyApplications,
  listMyEvents,
  updateEvent
} from "../controllers/event.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isArtist, isOrganiser } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/mine/list", protect, isOrganiser, listMyEvents);
router.get("/my-applications/list", protect, isArtist, listMyApplications);
router.get("/", listEvents);
router.get("/:id", getEvent);
router.post("/", protect, isOrganiser, createEvent);
router.put("/:id", protect, isOrganiser, updateEvent);
router.delete("/:id", protect, isOrganiser, deleteEvent);
router.post("/:id/apply", protect, isArtist, applyToEvent);
router.get("/:id/applicants", protect, isOrganiser, listApplicants);

export default router;
