import { Router } from "express";
import {
  applyForSponsorship,
  browseSponsorMarketplace,
  createSponsorTier
} from "../controllers/sponsor.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isOrganiser } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/browse", browseSponsorMarketplace);
router.post("/tiers", protect, createSponsorTier);
router.post("/apply", protect, isOrganiser, applyForSponsorship);

export default router;
