import { Router } from "express";
import { getReadiness } from "../controllers/readinessController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getReadiness);

export default router;
