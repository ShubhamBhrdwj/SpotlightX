import { Router } from "express";
import {
  getArtist,
  listArtists,
  updateArtist
} from "../controllers/artist.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isArtist } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", listArtists);
router.get("/:id", getArtist);
router.put("/me/profile", protect, isArtist, updateArtist);

export default router;
