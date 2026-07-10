import { Router } from "express";
import { listCoding, saveCoding } from "../controllers/codingController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listCoding);
router.post("/", requireAuth, saveCoding);

export default router;
