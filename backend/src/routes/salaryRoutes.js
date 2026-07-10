import { Router } from "express";
import { predictSalary } from "../controllers/salaryController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, predictSalary);

export default router;
