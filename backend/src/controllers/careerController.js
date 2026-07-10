import CareerAnalysis from "../models/CareerAnalysis.js";
import { generateJSON } from "../utils/gemini.js";
import { getUserContext } from "../utils/aiContext.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CAREER_PROMPT = (ctx) => `
You are an AI career analyst. Candidate: ${JSON.stringify(ctx)}.
Return JSON: {
  summary, strengths:[], improvements:[],
  path (target role), marketDemand (0-100), fit (0-100),
  roles:[{title, match}], salaryPrediction (string), topCompanies:[]
}`;

function fallback(ctx) {
  return {
    summary: `${ctx.name || "The candidate"} is building toward ${ctx.targetRole || "a software career"}.`,
    strengths: ctx.skills?.slice(0, 3) || ["Foundation skills"],
    improvements: ["Gain internship experience", "Build portfolio projects"],
    path: ctx.targetRole || "Software Engineer",
    marketDemand: 75,
    fit: 70,
    roles: [{ title: ctx.targetRole || "Software Engineer", match: 80 }],
    salaryPrediction: "Competitive for the role and location",
    topCompanies: ["Google", "Microsoft", "Amazon", "Lenovo", "Infosys"],
  };
}

export const getLatestCareer = asyncHandler(async (req, res) => {
  const latest = await CareerAnalysis.findOne({ user: req.user.id }).sort({ createdAt: -1 }).lean();
  if (!latest) return res.json({ analysis: null });
  res.json({ analysis: { ...latest, id: latest._id.toString() } });
});

export const analyzeCareer = asyncHandler(async (req, res) => {
  const ctx = await getUserContext(req.user.id);
  const data = await generateJSON(CAREER_PROMPT(ctx), fallback(ctx));
  const analysis = await CareerAnalysis.create({
    user: req.user.id,
    summary: data.summary,
    strengths: data.strengths,
    improvements: data.improvements,
    path: data.path,
    marketDemand: data.marketDemand,
    fit: data.fit,
    roles: data.roles,
    salaryPrediction: data.salaryPrediction,
    topCompanies: data.topCompanies,
  });
  res.status(201).json({ ...analysis.toObject(), id: analysis._id.toString() });
});
