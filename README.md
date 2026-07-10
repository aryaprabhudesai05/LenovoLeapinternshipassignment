# AI Career Mentor Portal

> A production-grade, AI-powered career development platform built with the **MERN** stack
> (MongoDB, Express, React, Node.js) and Google **Gemini**. It helps users analyze their
> career readiness, optimize resumes for ATS, discover skill gaps, generate learning
> roadmaps, prepare for interviews, and get AI-matched job recommendations.

This project was built as a capstone and follows production engineering practices:
centralized error handling, input validation, rate limiting, security headers,
structured logging, code-split routes, an error boundary, and a tested backend.

---

## ✨ Features

| Area | What it does |
| --- | --- |
| **Authentication** | Register / login with email + password, Google sign-in, and password reset (Firebase auth in mock mode). JWT-secured API. |
| **Career Analysis** | AI-generated career score, strengths, and improvement areas. |
| **ATS Resume Checker** | Upload a resume and get an ATS compatibility score, keyword coverage, and optimization tips. |
| **Skill Gap Analysis** | Identifies missing skills for target roles with prioritized learning paths. |
| **Learning Roadmap** | Personalized, step-by-step roadmap to reach career goals. |
| **Mock & Coding Interviews** | AI-driven behavioral and coding interview questions with feedback. |
| **Job Recommendations** | Role matches scored by skills and goals. |
| **Salary Prediction** | Estimated compensation ranges for target roles and locations. |
| **Career Readiness** | Composite readiness score across multiple dimensions. |
| **Resources** | Curated articles, videos, courses, and guides with search + filters. |
| **Analytics Dashboard** | Visual progress tracking with charts. |
| **Profile & Settings** | Editable profile, theme toggle (dark/light), and preferences. |

---

## 🧱 Tech Stack

**Frontend**
- React 19 + Vite 8
- React Router 7 (lazy-loaded, protected routes)
- Tailwind CSS v4 (theme tokens in `globals.css`)
- Recharts (data visualization)
- Framer Motion (animations) · Lucide React (icons) · React Hot Toast
- Axios (API client with mock fallback)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Google Gemini (`@google/generative-ai`) with a graceful mock fallback
- JSON Web Tokens (jsonwebtoken) + bcryptjs
- Cloudinary + Multer (file uploads)
- Built-in middleware for security headers, rate limiting, request logging,
  input validation, and async error handling (no extra security deps required)

---

## 📁 Project Structure

```
AI-Career-Mentor-Portal/
├── backend/                # Express API
│   ├── src/
│   │   ├── config/         # env, db, cloudinary
│   │   ├── controllers/    # route handlers
│   │   ├── middleware/     # auth, validate, security, rateLimit, requestLogger, errorHandler
│   │   ├── models/         # Mongoose schemas (User, Job, Resource, Resume, Analysis)
│   │   ├── routes/         # Express routers
│   │   ├── utils/          # gemini, mockData, asyncHandler, pagination, seed
│   │   └── app.js          # app factory (middleware pipeline)
│   ├── tests/              # node:test smoke tests
│   ├── server.js           # entry point
│   └── .env.example
└── frontend/               # React SPA
    ├── src/
    │   ├── components/     # ui, common, charts, dashboard, navbar, sidebar
    │   ├── context/        # AuthContext, ThemeContext
    │   ├── hooks/          # useAuth, useTheme, useLocalStorage
    │   ├── layouts/        # AuthLayout, DashboardLayout
    │   ├── pages/          # auth + dashboard pages
    │   ├── routes/         # AppRoutes, ProtectedRoute
    │   ├── services/       # api (axios + mock), firebase
    │   ├── styles/         # globals.css (theme tokens)
    │   └── utils/          # mockData, constants, format
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas). The app also runs in **mock mode** without a database.

### 1. Backend
```bash
cd backend
cp .env.example .env        # then edit values
npm install
npm run seed                # optional: seed jobs & resources into MongoDB
npm run dev                 # http://localhost:8000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env        # VITE_USE_MOCK=true runs fully on local mock data
npm install
npm run dev                 # http://localhost:3000
```

> **Live mode (default):** with `VITE_USE_MOCK=false` (the default) the frontend talks to
> the real Express API and stores everything per-user in MongoDB. Authentication uses the
> app's own JWT backend (register/login/me/forgot), not Firebase. Set `VITE_USE_MOCK=true`
> only to run the legacy offline demo with built-in mock data (no backend required).

---

## 🧪 Scripts

| Location | Command | Description |
| --- | --- | --- |
| backend | `npm run dev` | Start API with hot reload |
| backend | `npm run seed` | Seed jobs & resources into MongoDB |
| backend | `npm test` | Run backend tests (`node --test`) |
| backend | `npm run lint` | Lint with ESLint (flat config) |
| frontend | `npm run dev` | Start Vite dev server |
| frontend | `npm run build` | Production build |
| frontend | `npm run lint` | Lint with Oxlint |
| frontend | `npm run preview` | Preview production build |

---

## 🗄️ Database Collections

All data is scoped to the logged-in user (`userId`). The API never returns another
user's data.

| Collection | Purpose |
| --- | --- |
| `users` | Auth: name, email, bcrypt password hash, avatar, role |
| `profiles` | Extended candidate profile (phone, college, degree, skills, projects, links…) |
| `resumes` | Uploaded resumes + AI-extracted insights, scores, history |
| `atsresults` | ATS scans (score, keywords, tips) |
| `careeranalyses` | Career path, roles, salary, companies |
| `learningroadmaps` | Personalized roadmap with per-step progress |
| `skillgaps` | Missing skills + recommended courses vs a target role |
| `interviewsessions` | Mock video interviews: per-question scores, transcript, report |
| `codingsessions` | Coding attempts, score, duration |
| `jobrecommendations` | Stored job recommendations |
| `analytics` | Periodic score snapshots for charts |
| `notifications` | Per-user notifications |

## 🔌 API Reference

Base URL: `/api`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | – | Create account (validated, rate-limited) |
| POST | `/auth/login` | – | Authenticate, returns JWT |
| GET | `/auth/me` | ✅ | Current user profile |
| GET | `/dashboard` | ✅ | Dashboard summary |
| POST | `/resume` | ✅ | Analyze a resume |
| GET/POST | `/career` | ✅ | Career analysis |
| GET/POST | `/ats` | ✅ | ATS score |
| GET/POST | `/skill` | ✅ | Skill gap analysis |
| GET/POST | `/roadmap` | ✅ | Learning roadmap |
| GET | `/jobs` | – | Job recommendations (`?page=&limit=`) |
| GET | `/salary` | ✅ | Salary prediction |
| GET | `/readiness` | ✅ | Career readiness score |
| GET | `/analytics` | ✅ | Analytics data |
| GET/POST | `/interview` | ✅ | Interview Q&A |
| POST | `/chat` | ✅ | AI career chat |
| GET/PUT | `/profile` | ✅ | User profile |
| GET | `/resources` | – | Learning resources (`?page=&limit=`) |

---

## 🛡️ Production & Security Notes

- **Input validation** on auth and key endpoints (`src/middleware/validate.js`).
- **Rate limiting** (in-memory fixed window) with `X-RateLimit-*` headers,
  stricter limits on auth routes (`src/middleware/rateLimit.js`).
- **Security headers**: CSP, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS in production
  (`src/middleware/security.js`).
- **Structured request logging** with method, status, duration, IP
  (`src/middleware/requestLogger.js`).
- **Centralized error handling** with `HttpError` and a 404 handler
  (`src/middleware/errorHandler.js`).
- **Async error propagation** via `asyncHandler` (no silent crashes).
- **Password hashing** with bcrypt; passwords excluded from responses.
- **Frontend**: React Error Boundary, lazy-loaded routes, and a typed API client
  with a mock fallback.
- **Graceful degradation**: the AI layer falls back to curated mock data when no
  `GEMINI_API_KEY` is configured (`backend/src/utils/gemini.js`).

### Deployment
- Build the frontend (`npm run build`) and serve `dist/` from a static host
  (Vercel / Netlify / S3+CloudFront).
- Run the backend behind a process manager (PM2) or container; set
  `NODE_ENV=production`, a strong `JWT_SECRET`, and real `MONGODB_URI`.
- For multi-instance rate limiting, swap the in-memory store in
  `rateLimit.js` for Redis.

---

## 📝 Environment Variables

See [`backend/.env.example`](backend/.env.example) and
[`frontend/.env.example`](frontend/.env.example) for the full list. **Never commit
real secrets** — `.env` files are excluded from version control.
