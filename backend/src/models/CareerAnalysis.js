import mongoose from "mongoose";

const CareerAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    summary: String,
    strengths: [String],
    improvements: [String],
    path: String,
    marketDemand: Number,
    fit: Number,
    roles: [{ title: String, match: Number }],
    salaryPrediction: String,
    topCompanies: [String],
  },
  { timestamps: true }
);

export default mongoose.model("CareerAnalysis", CareerAnalysisSchema);
