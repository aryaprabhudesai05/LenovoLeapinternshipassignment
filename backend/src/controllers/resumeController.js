import Resume from "../models/Resume.js";
import { uploadFile } from "../config/cloudinary.js";
import { generateResumeAnalysis, extractPdfText, detectFileKind } from "../utils/gemini.js";
import { getUserContext } from "../utils/aiContext.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../middleware/errorHandler.js";

const RESUME_PROMPT = (ctx, text) => `
You are an expert resume reviewer. Candidate: ${JSON.stringify(ctx)}.
${text ? `Resume text:\n${text.slice(0, 5000)}` : "No text provided; infer from the candidate profile."}
Return JSON: {
  extracted: { name, education:[], experience:[], projects:[], certificates:[],
    technicalSkills:[], softSkills:[], strengths:[], weaknesses:[] },
  resumeScore (0-100), atsScore (0-100), careerScore (0-100),
  summary (string), suggestions:[]
}`;

function userSpecificFallback(ctx) {
  const skills = ctx.skills || [];
  return {
    extracted: {
      name: ctx.name,
      education: ctx.education ? [ctx.education] : [],
      experience: ctx.experience || [],
      projects: ctx.projects || [],
      certificates: [],
      technicalSkills: skills,
      softSkills: ["Communication", "Teamwork"],
      strengths: skills.slice(0, 3),
      weaknesses: ["Add measurable outcomes to experience"],
    },
    resumeScore: 70,
    atsScore: 72,
    careerScore: 70,
    summary: `Resume for ${ctx.name || "candidate"} targeting ${ctx.targetRole || "software roles"}.`,
    suggestions: ["Quantify achievements", "Add keywords for " + (ctx.targetRole || "your role")],
  };
}

export const listResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json({ resumes: resumes.map((r) => ({ ...r, id: r._id.toString() })) });
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id }).lean();
  if (!resume) throw new HttpError(404, "Resume not found");
  res.json({ ...resume, id: resume._id.toString() });
});

export const compareResumes = asyncHandler(async (req, res) => {
  const { a, b } = req.query;
  const [ra, rb] = await Promise.all([
    Resume.findOne({ _id: a, user: req.user.id }).lean(),
    Resume.findOne({ _id: b, user: req.user.id }).lean(),
  ]);
  if (!ra || !rb) throw new HttpError(404, "One or both resumes not found");
  res.json({
    a: { ...ra, id: ra._id.toString() },
    b: { ...rb, id: rb._id.toString() },
  });
});

export const analyzeResume = asyncHandler(async (req, res) => {
  const ctx = await getUserContext(req.user.id);
  const text = req.body?.text || "";
  const data = await generateResumeAnalysis(RESUME_PROMPT(ctx, text), {
    text,
    fallback: userSpecificFallback(ctx),
  });
  res.json(data);
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError(400, "No file uploaded");

  const fileName = req.file.originalname;
  const ctx = await getUserContext(req.user.id);
  const { kind, mime } = detectFileKind(req.file);

  if (kind === "unknown") {
    throw new HttpError(400, "Unsupported file type. Upload a PDF, DOC, DOCX, TXT, or an image (PNG/JPG).");
  }

  let fileUrl = "";
  let publicId = "";
  try {
    const uploaded = await uploadFile(req.file.buffer);
    fileUrl = uploaded.url;
    publicId = uploaded.publicId;
  } catch (e) {
    console.warn("[resume] file storage skipped:", e.message);
  }

  let text = "";
  let imageBuffer = null;
  try {
    if (kind === "image") {
      imageBuffer = req.file.buffer;
    } else if (kind === "pdf") {
      text = (await extractPdfText(req.file.buffer)).slice(0, 6000);
    } else {
      text = req.file.buffer.toString("utf8").slice(0, 6000);
    }
  } catch (e) {
    console.warn("[resume] file parse failed, continuing with available data:", e.message);
  }

  let data;
  try {
    data = await generateResumeAnalysis(RESUME_PROMPT(ctx, text), {
      text,
      imageBuffer,
      mimeType: mime,
      fallback: userSpecificFallback(ctx),
    });
  } catch (e) {
    console.error("[resume] analysis error:", e.message);
    data = userSpecificFallback(ctx);
  }

  const resume = await Resume.create({
    user: req.user.id,
    fileName,
    fileUrl,
    publicId,
    resumeText: text,
    extracted: data.extracted,
    resumeScore: data.resumeScore,
    atsScore: data.atsScore,
    careerScore: data.careerScore,
    summary: data.summary,
    suggestions: data.suggestions,
  });

  const response = { ...resume.toObject(), id: resume._id.toString() };
  // Surface a user-facing notice (e.g. image-input unsupported) so the
  // frontend can inform the user instead of failing silently.
  if (data?.notice) response.notice = data.notice;
  res.status(201).json(response);
});
