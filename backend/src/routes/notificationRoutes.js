import { Router } from "express";
import {
  listNotifications,
  markRead,
  markAllRead,
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listNotifications);
router.patch("/:id/read", requireAuth, markRead);
router.post("/read-all", requireAuth, markAllRead);

export default router;
