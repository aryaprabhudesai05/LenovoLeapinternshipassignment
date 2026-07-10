from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.config import settings
from app.routers import (
    auth,
    resume,
    career,
    ats,
    interview,
    roadmap,
    skillgap,
    jobs,
    salary,
    dashboard,
)

load_dotenv()

app = FastAPI(
    title="AI Career Mentor Portal API",
    description="Backend API for the AI Career Mentor Portal (Lenovo LEAP Capstone)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API = settings.API_V1_PREFIX

app.include_router(auth.router, prefix=API)
app.include_router(resume.router, prefix=API)
app.include_router(career.router, prefix=API)
app.include_router(ats.router, prefix=API)
app.include_router(interview.router, prefix=API)
app.include_router(roadmap.router, prefix=API)
app.include_router(skillgap.router, prefix=API)
app.include_router(jobs.router, prefix=API)
app.include_router(salary.router, prefix=API)
app.include_router(dashboard.router, prefix=API)


@app.get("/")
def root():
    return {"message": "AI Career Mentor Portal API", "status": "running"}


@app.get("/health")
def health():
    return {"status": "ok"}
