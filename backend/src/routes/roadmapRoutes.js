import { Router } from "express";
import { getLatestRoadmap, generateRoadmap, updateStep } from "../controllers/roadmapController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getLatestRoadmap);
router.post("/", requireAuth, generateRoadmap);
router.patch("/:id/steps/:stepId", requireAuth, updateStep);

export default router;
