import ATSResult from "../models/ATSResult.js";
import { generateJSON } from "../utils/gemini.js";
import { getUserContext } from "../utils/aiContext.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const ATS_PROMPT = (ctx, targetRole) => `
You are an ATS optimizer. Candidate: ${JSON.stringify(ctx)}.
Target role: ${targetRole || ctx.targetRole || "Software Developer"}.
Return JSON: { score (0-100), keywordsFound:[], keywordsMissing:[], tips:[] }.`;

function fallback(ctx, targetRole) {
  const skills = ctx.skills || [];
  return {
    score: 70,
    keywordsFound: skills.slice(0, 5),
    keywordsMissing: ["Leadership", "Agile", targetRole || ctx.targetRole || "System Design"],
    tips: ["Mirror the job description keywords", "Use standard section headings"],
  };
}

export const getAtsHistory = asyncHandler(async (req, res) => {
  const results = await ATSResult.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json({ results: results.map((r) => ({ ...r, id: r._id.toString() })) });
});

export const scanAts = asyncHandler(async (req, res) => {
  const ctx = await getUserContext(req.user.id);
  const targetRole = req.body?.targetRole || ctx.targetRole || "";
  const data = await generateJSON(ATS_PROMPT(ctx, targetRole), fallback(ctx, targetRole));
  const result = await ATSResult.create({
    user: req.user.id,
    targetRole,
    score: data.score,
    keywordsFound: data.keywordsFound,
    keywordsMissing: data.keywordsMissing,
    tips: data.tips,
  });
  res.status(201).json({ ...result.toObject(), id: result._id.toString() });
});
