import mongoose from "mongoose";

const JobRecommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: String,
    role: String,
    location: String,
    experience: String,
    jobs: [
      {
        title: String,
        company: String,
        location: String,
        type: String,
        salary: String,
        match: Number,
        missingSkills: [String],
        tips: [String],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("JobRecommendation", JobRecommendationSchema);
