import { Router } from "express";
import {
  getJobs,
  recommendJobs,
  getRecommendations,
} from "../controllers/jobController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getJobs);
router.post("/recommend", requireAuth, recommendJobs);
router.get("/recommendations", requireAuth, getRecommendations);

export default router;
