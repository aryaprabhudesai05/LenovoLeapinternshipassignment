import Job from "../models/Job.js";
import JobRecommendation from "../models/JobRecommendation.js";
import { generateJSON } from "../utils/gemini.js";
import { getUserContext } from "../utils/aiContext.js";
import { mockData } from "../utils/mockData.js";
import { parsePagination, withId } from "../utils/pagination.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getJobs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req, { page: 1, limit: 20, maxLimit: 100 });
  let jobs = await Job.find().skip(skip).limit(limit).lean();
  let total = await Job.countDocuments();
  if (!jobs.length) {
    const seeded = mockData.jobs().jobs;
    total = seeded.length;
    jobs = seeded.slice(skip, skip + limit);
  }
  res.json({ jobs: jobs.map(withId), page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
});

export const recommendJobs = asyncHandler(async (req, res) => {
  const ctx = await getUserContext(req.user.id);
  const { company, role, location, experience } = req.body || {};
  const prompt = `
You are a job matching engine. Candidate: ${JSON.stringify(ctx)}.
Preferences: company=${company || "Any"}, role=${role || ctx.targetRole || "Software"},
location=${location || "Any"}, experience=${experience || "Any"}.
Return JSON: { jobs:[{ title, company, location, type, salary, match (0-100),
missingSkills:[], tips:[] }] } with 6 relevant roles.`;

  const data = await generateJSON(prompt, {
    jobs: (mockData.jobs().jobs || []).slice(0, 6).map((j) => ({
      ...j,
      match: 75,
      missingSkills: ["System Design"],
      tips: ["Prepare behavioral stories"],
    })),
  });

  const record = await JobRecommendation.create({
    user: req.user.id,
    company,
    role,
    location,
    experience,
    jobs: data.jobs,
  });
  res.status(201).json({ ...record.toObject(), id: record._id.toString() });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const recs = await JobRecommendation.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json({ recommendations: recs.map((r) => ({ ...r, id: r._id.toString() })) });
});
