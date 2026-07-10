import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { apiRoutes } from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { securityHeaders } from "./middleware/security.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { rateLimit } from "./middleware/rateLimit.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin, credentials: true }));
  app.use(securityHeaders());
  app.use(requestLogger());
  // Global default rate limit (per IP), stricter limits applied per-route.
  app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => res.json({ message: "AI Career Mentor Portal API", status: "running" }));
  app.get("/health", (req, res) => res.json({ status: "ok" }));

  apiRoutes.forEach(({ path, router }) => app.use(`/api${path}`, router));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;
