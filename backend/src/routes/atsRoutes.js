import { Router } from "express";
import { getAtsHistory, scanAts } from "../controllers/atsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getAtsHistory);
router.post("/", requireAuth, scanAts);

export default router;
