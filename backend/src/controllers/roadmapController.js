import LearningRoadmap from "../models/LearningRoadmap.js";
import { generateJSON } from "../utils/gemini.js";
import { getUserContext } from "../utils/aiContext.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../middleware/errorHandler.js";

const ROADMAP_PROMPT = (ctx) => `
You are a learning path planner. Candidate: ${JSON.stringify(ctx)}.
Goal: ${ctx.targetRole || "Full Stack Developer"}. Skills: ${JSON.stringify(ctx.skills || [])}.
Return JSON: { steps: [{ title, weeks (e.g. "1-3"), detail, status:"pending" }] } with 6 logical steps.`;

function fallback(ctx) {
  const goal = ctx.targetRole || "Full Stack Developer";
  return {
    steps: [
      { title: "HTML & CSS Basics", weeks: "1-2", detail: "Build semantic pages and responsive layouts.", status: "pending" },
      { title: "JavaScript Fundamentals", weeks: "3-4", detail: "Master ES6, DOM, and async.", status: "pending" },
      { title: "React", weeks: "5-7", detail: "Components, hooks, state management.", status: "pending" },
      { title: "Node.js & APIs", weeks: "8-10", detail: "Build REST APIs and auth.", status: "pending" },
      { title: "Databases (MongoDB)", weeks: "11-12", detail: "Model data and write queries.", status: "pending" },
      { title: "Projects & Deployment", weeks: "13-14", detail: "Ship a portfolio project for " + goal + ".", status: "pending" },
    ],
  };
}

export const getLatestRoadmap = asyncHandler(async (req, res) => {
  const latest = await LearningRoadmap.findOne({ user: req.user.id }).sort({ createdAt: -1 }).lean();
  if (!latest) return res.json({ roadmap: null });
  res.json({ roadmap: { ...latest, id: latest._id.toString() } });
});

export const generateRoadmap = asyncHandler(async (req, res) => {
  const ctx = await getUserContext(req.user.id);
  if (req.body?.goal) ctx.targetRole = req.body.goal;
  const data = await generateJSON(ROADMAP_PROMPT(ctx), fallback(ctx));
  const roadmap = await LearningRoadmap.create({
    user: req.user.id,
    goal: ctx.targetRole,
    steps: (data.steps || []).map((s) => ({
      title: s.title,
      weeks: s.weeks,
      detail: s.detail,
      status: s.status || "pending",
    })),
  });
  res.status(201).json({ ...roadmap.toObject(), id: roadmap._id.toString() });
});

export const updateStep = asyncHandler(async (req, res) => {
  const roadmap = await LearningRoadmap.findOne({ _id: req.params.id, user: req.user.id });
  if (!roadmap) throw new HttpError(404, "Roadmap not found");
  const step = roadmap.steps.id(req.params.stepId);
  if (!step) return res.status(404).json({ error: "NotFound", message: "Step not found" });
  if (req.body?.status) step.status = req.body.status;
  await roadmap.save();
  res.json({ ...roadmap.toObject(), id: roadmap._id.toString() });
});
