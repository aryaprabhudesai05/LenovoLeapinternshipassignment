import SkillGap from "../models/SkillGap.js";
import { generateJSON } from "../utils/gemini.js";
import { getUserContext } from "../utils/aiContext.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const SKILLGAP_PROMPT = (ctx, required) => `
You are a skill gap analyzer. Candidate skills: ${JSON.stringify(ctx.skills || [])}.
Required for ${ctx.targetRole}: ${JSON.stringify(required)}.
Return JSON: { gaps:[{skill, level (0-100 current), required (0-100), priority:"High"|"Medium"|"Low"}], courses:[{skill, course, hours}] }.`;

function fallback(ctx, required) {
  const current = ctx.skills || [];
  const missing = (required || []).filter((r) => !current.includes(r));
  return {
    gaps: missing.map((skill, i) => ({
      skill,
      level: 20,
      required: 90,
      priority: i === 0 ? "High" : "Medium",
    })),
    courses: missing.map((skill) => ({ skill, course: `${skill} — Crash Course`, hours: 12 })),
  };
}

export const getLatestSkillGap = asyncHandler(async (req, res) => {
  const latest = await SkillGap.findOne({ user: req.user.id }).sort({ createdAt: -1 }).lean();
  if (!latest) return res.json({ skillGap: null });
  res.json({ skillGap: { ...latest, id: latest._id.toString() } });
});

export const analyzeSkillGap = asyncHandler(async (req, res) => {
  const ctx = await getUserContext(req.user.id);
  const required = req.body?.required || req.body?.current || [];
  if (req.body?.targetRole) ctx.targetRole = req.body.targetRole;
  const data = await generateJSON(SKILLGAP_PROMPT(ctx, required), fallback(ctx, required));
  const record = await SkillGap.create({
    user: req.user.id,
    targetRole: ctx.targetRole,
    current: ctx.skills,
    required,
    gaps: data.gaps,
    courses: data.courses,
  });
  res.status(201).json({ ...record.toObject(), id: record._id.toString() });
});
