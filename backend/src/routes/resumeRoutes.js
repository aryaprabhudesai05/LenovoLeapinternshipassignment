import { Router } from "express";
import {
  listResumes,
  getResume,
  compareResumes,
  analyzeResume,
  uploadResume,
} from "../controllers/resumeController.js";
import { handleUpload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listResumes);
router.get("/compare", requireAuth, compareResumes);
router.get("/:id", requireAuth, getResume);
router.post("/analyze", requireAuth, analyzeResume);
router.post("/upload", requireAuth, handleUpload, uploadResume);

export default router;
