import { Router } from "express";
import { getLatestSkillGap, analyzeSkillGap } from "../controllers/skillGapController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getLatestSkillGap);
router.post("/", requireAuth, analyzeSkillGap);

export default router;
