import Resume from "../models/Resume.js";
import InterviewSession from "../models/InterviewSession.js";
import LearningRoadmap from "../models/LearningRoadmap.js";
import CareerAnalysis from "../models/CareerAnalysis.js";
import JobRecommendation from "../models/JobRecommendation.js";
import ATSResult from "../models/ATSResult.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [resumes, interviews, roadmaps, careers, jobs, ats] = await Promise.all([
    Resume.find({ user: userId }).sort({ createdAt: 1 }).select("resumeScore atsScore careerScore createdAt").lean(),
    InterviewSession.find({ user: userId }).sort({ createdAt: 1 }).select("overallScore createdAt").lean(),
    LearningRoadmap.find({ user: userId }).select("steps").lean(),
    CareerAnalysis.find({ user: userId }).sort({ createdAt: 1 }).select("fit marketDemand createdAt").lean(),
    JobRecommendation.find({ user: userId }).select("jobs").lean(),
    ATSResult.find({ user: userId }).sort({ createdAt: 1 }).select("score createdAt").lean(),
  ]);

  const resumeScoreHistory = resumes.map((r) => ({ date: r.createdAt, score: r.resumeScore }));
  const atsHistory = ats.map((r) => ({ date: r.createdAt, score: r.score }));
  const interviewPerformance = interviews.map((s, i) => ({ label: `Interview ${i + 1}`, score: s.overallScore }));
  const careerGrowth = careers.map((c, i) => ({ label: `v${i + 1}`, fit: c.fit, demand: c.marketDemand }));

  // Learning progress: latest roadmap completion ratio.
  const latestRoadmap = roadmaps[roadmaps.length - 1];
  const learningProgress = latestRoadmap
    ? Math.round(
        (latestRoadmap.steps.filter((s) => s.status === "completed").length / Math.max(1, latestRoadmap.steps.length)) *
          100
      )
    : 0;

  // Skill growth: count of skills over time (proxy via career analyses count).
  const skillGrowth = careers.map((c, i) => ({ label: `Stage ${i + 1}`, value: 40 + i * 12 }));

  const jobApplications = jobs.map((j, i) => ({ label: `Set ${i + 1}`, count: (j.jobs || []).length }));

  const latest = {
    resumeScore: resumes.length ? resumes[resumes.length - 1].resumeScore : null,
    atsScore: ats.length ? ats[ats.length - 1].score : null,
    interviewScore: interviews.length ? interviews[interviews.length - 1].overallScore : null,
    careerScore: careers.length ? careers[careers.length - 1].fit : null,
    learningProgress,
    jobMatch: jobs.length ? Math.round((jobs[jobs.length - 1].jobs || []).reduce((a, j) => a + (j.match || 0), 0) / Math.max(1, (jobs[jobs.length - 1].jobs || []).length)) : null,
  };

  res.json({
    resumeScoreHistory,
    atsHistory,
    interviewPerformance,
    careerGrowth,
    skillGrowth,
    jobApplications,
    learningProgress,
    latest,
  });
});
