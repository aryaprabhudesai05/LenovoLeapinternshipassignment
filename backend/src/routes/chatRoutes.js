import { Router } from "express";
import { getChat, postChat } from "../controllers/chatController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getChat);
router.post("/", requireAuth, postChat);

export default router;
