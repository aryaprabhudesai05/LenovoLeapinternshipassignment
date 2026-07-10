import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Resume from "../models/Resume.js";
import ATSResult from "../models/ATSResult.js";
import CareerAnalysis from "../models/CareerAnalysis.js";
import LearningRoadmap from "../models/LearningRoadmap.js";
import InterviewSession from "../models/InterviewSession.js";
import JobRecommendation from "../models/JobRecommendation.js";
import Notification from "../models/Notification.js";
import { computeReadiness } from "../utils/aiContext.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [user, profile, resume, ats, career, roadmap, interviews, jobs, notifications] = await Promise.all([
    User.findById(userId).lean(),
    Profile.findOne({ user: userId }).lean(),
    Resume.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    ATSResult.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    CareerAnalysis.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    LearningRoadmap.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    InterviewSession.find({ user: userId }).sort({ createdAt: -1 }).lean(),
    JobRecommendation.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  const ctx = {
    name: user?.name,
    skills: profile?.skills || user?.skills || [],
    projects: profile?.projects || [],
    experience: profile?.experience || [],
    education: [profile?.college, profile?.degree].filter(Boolean).join(", "),
    targetRole: profile?.targetRole || user?.role,
    linkedIn: profile?.linkedIn,
    github: profile?.github,
  };

  const careerScore = career?.fit ?? resume?.careerScore ?? null;
  const atsScore = ats?.score ?? resume?.atsScore ?? null;
  const interviewScore = interviews[0]?.overallScore ?? null;
  const resumeStatus = resume ? "Uploaded" : "Not uploaded";
  const jobMatch = jobs?.jobs?.length
    ? Math.round(jobs.jobs.reduce((a, j) => a + (j.match || 0), 0) / jobs.jobs.length)
    : null;
  const learningProgress = roadmap
    ? Math.round(
        (roadmap.steps.filter((s) => s.status === "completed").length / Math.max(1, roadmap.steps.length)) * 100
      )
    : 0;

  const activity = [
    resume && { type: "resume", text: `Resume analyzed — score ${resume.resumeScore}`, at: resume.createdAt },
    ats && { type: "ats", text: `ATS scan — score ${ats.score}`, at: ats.createdAt },
    career && { type: "career", text: `Career analysis generated`, at: career.createdAt },
    interviews[0] && { type: "interview", text: `Interview completed — ${interviews[0].overallScore}/100`, at: interviews[0].createdAt },
    jobs && { type: "job", text: `Job recommendations refreshed`, at: jobs.createdAt },
  ].filter(Boolean).sort((a, b) => new Date(b.at) - new Date(a.at));

  res.json({
    candidate: {
      id: userId,
      name: user?.name,
      email: user?.email,
      avatar: profile?.profileImage || user?.avatar,
      role: profile?.targetRole || user?.role,
      targetRole: profile?.targetRole,
      location: profile?.location || user?.location,
    },
    scores: {
      careerScore,
      atsScore,
      interviewScore,
      learningProgress,
      jobMatch,
      resumeStatus,
      readiness: computeReadiness(ctx),
    },
    interviewCount: interviews.length,
    latestInterview: interviews[0] ? { id: interviews[0]._id.toString(), overallScore: interviews[0].overallScore, company: interviews[0].company, role: interviews[0].role } : null,
    latestRoadmap: roadmap ? { id: roadmap._id.toString(), goal: roadmap.goal, steps: roadmap.steps } : null,
    latestCareer: career ? { summary: career.summary, path: career.path, roles: career.roles } : null,
    activity,
    notifications: notifications.map((n) => ({ ...n, id: n._id.toString() })),
  });
});
