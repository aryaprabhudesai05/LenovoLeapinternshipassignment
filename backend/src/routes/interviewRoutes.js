import { Router } from "express";
import {
  listInterviews,
  getInterview,
  getResult,
  saveInterview,
  startInterview,
  answerInterview,
  endInterview,
  hrQuestion,
  interviewFeedback,
} from "../controllers/interviewController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listInterviews);
// NOTE: /result/:id must be registered before /:id so it is not shadowed.
router.get("/result/:id", requireAuth, getResult);
router.get("/:id", requireAuth, getInterview);
router.post("/", requireAuth, saveInterview);
router.post("/start", requireAuth, startInterview);
router.post("/answer", requireAuth, answerInterview);
router.post("/end", requireAuth, endInterview);
router.post("/hr", requireAuth, hrQuestion);
router.post("/feedback", requireAuth, interviewFeedback);

export default router;
