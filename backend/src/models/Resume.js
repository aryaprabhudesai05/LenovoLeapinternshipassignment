import mongoose from "mongoose";

// A single uploaded resume with AI-extracted insights and scores.
const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: String,
    fileUrl: String,
    publicId: String,
    resumeText: String,
    extracted: {
      name: String,
      education: [String],
      experience: [String],
      projects: [String],
      certificates: [String],
      technicalSkills: [String],
      softSkills: [String],
      strengths: [String],
      weaknesses: [String],
    },
    resumeScore: Number,
    atsScore: Number,
    careerScore: Number,
    summary: String,
    suggestions: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
