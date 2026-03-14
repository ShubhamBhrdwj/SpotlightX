import { Router } from "express";
import {
  getOrganiser,
  updateOrganiser
} from "../controllers/organiser.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isOrganiser } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/:id", getOrganiser);
router.put("/me/profile", protect, isOrganiser, updateOrganiser);

export default router;
