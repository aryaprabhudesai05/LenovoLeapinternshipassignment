import { Router } from "express";
import { getResources } from "../controllers/resourceController.js";

const router = Router();

router.get("/", getResources);

export default router;
