import mongoose from "mongoose";
import { env } from "../config/env.js";
import Job from "../models/Job.js";
import Resource from "../models/Resource.js";
import { mockData } from "../utils/mockData.js";

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log("[seed] Connected to MongoDB");

  const jobs = mockData.jobs().jobs.map(({ id, ...rest }) => rest);
  await Job.deleteMany({});
  await Job.insertMany(jobs);
  console.log(`[seed] Inserted ${jobs.length} jobs`);

  const resources = mockData.resources().resources.map(({ id, ...rest }) => rest);
  await Resource.deleteMany({});
  await Resource.insertMany(resources);
  console.log(`[seed] Inserted ${resources.length} resources`);

  await mongoose.disconnect();
  console.log("[seed] Done");
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
