import { Router } from "express";
import { getLatestCareer, analyzeCareer } from "../controllers/careerController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getLatestCareer);
router.post("/", requireAuth, analyzeCareer);

export default router;
