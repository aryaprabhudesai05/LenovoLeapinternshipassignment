import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import resumeRoutes from "./resumeRoutes.js";
import careerRoutes from "./careerRoutes.js";
import atsRoutes from "./atsRoutes.js";
import skillGapRoutes from "./skillGapRoutes.js";
import roadmapRoutes from "./roadmapRoutes.js";
import jobRoutes from "./jobRoutes.js";
import salaryRoutes from "./salaryRoutes.js";
import readinessRoutes from "./readinessRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import interviewRoutes from "./interviewRoutes.js";
import chatRoutes from "./chatRoutes.js";
import profileRoutes from "./profileRoutes.js";
import resourceRoutes from "./resourceRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

export const apiRoutes = [
  { path: "/auth", router: authRoutes },
  { path: "/dashboard", router: dashboardRoutes },
  { path: "/resume", router: resumeRoutes },
  { path: "/career", router: careerRoutes },
  { path: "/ats", router: atsRoutes },
  { path: "/skill", router: skillGapRoutes },
  { path: "/roadmap", router: roadmapRoutes },
  { path: "/jobs", router: jobRoutes },
  { path: "/salary", router: salaryRoutes },
  { path: "/readiness", router: readinessRoutes },
  { path: "/analytics", router: analyticsRoutes },
  { path: "/interview", router: interviewRoutes },
  { path: "/chat", router: chatRoutes },
  { path: "/profile", router: profileRoutes },
  { path: "/resources", router: resourceRoutes },
  { path: "/notifications", router: notificationRoutes },
];
