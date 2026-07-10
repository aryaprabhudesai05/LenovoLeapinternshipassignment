import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    match: Number,
    type: String,
    salary: String,
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
