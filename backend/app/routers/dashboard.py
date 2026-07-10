from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.ai.agents import (
    career_analysis_agent,
    skill_gap_agent,
    learning_roadmap_agent,
    job_recommendation_agent,
    salary_prediction_agent,
    resume_ats_agent,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def summary(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return {
        "careerScore": 86,
        "atsScore": 82,
        "learningProgress": 74,
        "jobMatch": 81,
        "resumeScore": 84,
        "profileStrength": 78,
        "readiness": 79,
        "trends": {"careerScore": 4, "atsScore": 2, "learningProgress": 6, "jobMatch": -3},
        "salary": [
            {"month": "Jan", "value": 6.2}, {"month": "Feb", "value": 6.5},
            {"month": "Mar", "value": 7.1}, {"month": "Apr", "value": 7.4},
            {"month": "May", "value": 8.0}, {"month": "Jun", "value": 8.6},
        ],
        "skills": [
            {"name": "React", "level": 90}, {"name": "Node.js", "level": 75},
            {"name": "Python", "level": 85}, {"name": "SQL", "level": 60},
            {"name": "AWS", "level": 45}, {"name": "ML", "level": 55},
        ],
        "activity": [
            {"name": "Mon", "visits": 12}, {"name": "Tue", "visits": 18},
            {"name": "Wed", "visits": 9}, {"name": "Thu", "visits": 22},
            {"name": "Fri", "visits": 16}, {"name": "Sat", "visits": 7},
            {"name": "Sun", "visits": 5},
        ],
        "recommendations": [
            {"title": "Improve SQL proficiency", "detail": "Complete advanced SQL course", "priority": "High"},
            {"title": "Add cloud projects", "detail": "Deploy 2 apps on AWS", "priority": "Medium"},
            {"title": "Certify in ML", "detail": "Andrew Ng specialization", "priority": "Medium"},
        ],
    }
