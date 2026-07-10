import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

import ProtectedRoute from "./ProtectedRoute";
import ErrorBoundary from "../components/common/ErrorBoundary";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const ResumeAnalyzer = lazy(() => import("../pages/dashboard/ResumeAnalyzer"));
const CareerAnalysis = lazy(() => import("../pages/dashboard/CareerAnalysis"));
const SkillGap = lazy(() => import("../pages/dashboard/SkillGap"));
const LearningRoadmap = lazy(() => import("../pages/dashboard/LearningRoadmap"));
const MockInterview = lazy(() => import("../pages/dashboard/MockInterview"));
const CodingInterview = lazy(() => import("../pages/dashboard/CodingInterview"));
const JobRecommendation = lazy(() => import("../pages/dashboard/JobRecommendation"));
const SalaryPrediction = lazy(() => import("../pages/dashboard/SalaryPrediction"));
const CareerReadiness = lazy(() => import("../pages/dashboard/CareerReadiness"));
const ATSChecker = lazy(() => import("../pages/dashboard/ATSChecker"));
const Analytics = lazy(() => import("../pages/dashboard/Analytics"));
const Resources = lazy(() => import("../pages/dashboard/Resources"));
const Settings = lazy(() => import("../pages/dashboard/Settings"));
const Profile = lazy(() => import("../pages/dashboard/Profile"));
import NotFound from "../pages/NotFound";

const dashboardRoutes = [
  { path: "resume", element: <ResumeAnalyzer /> },
  { path: "career", element: <CareerAnalysis /> },
  { path: "skill-gap", element: <SkillGap /> },
  { path: "roadmap", element: <LearningRoadmap /> },
  { path: "interview", element: <MockInterview /> },
  { path: "coding", element: <CodingInterview /> },
  { path: "jobs", element: <JobRecommendation /> },
  { path: "salary", element: <SalaryPrediction /> },
  { path: "readiness", element: <CareerReadiness /> },
  { path: "ats", element: <ATSChecker /> },
  { path: "analytics", element: <Analytics /> },
  { path: "resources", element: <Resources /> },
  { path: "settings", element: <Settings /> },
  { path: "profile", element: <Profile /> },
];

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          {dashboardRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
