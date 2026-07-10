from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.ai.agents import (
    skill_gap_agent,
    learning_roadmap_agent,
    mock_hr_interview_agent,
    coding_interview_agent,
    job_recommendation_agent,
    salary_prediction_agent,
    mentor_chat_agent,
)

router = APIRouter(prefix="/interview", tags=["Interview"])


@router.post("/hr")
def hr_interview(payload: dict, user=Depends(get_current_user)):
    return mock_hr_interview_agent()


@router.post("/coding")
def coding_interview(payload: dict, user=Depends(get_current_user)):
    return coding_interview_agent()


@router.post("/feedback")
def interview_feedback(payload: dict, user=Depends(get_current_user)):
    return {"feedback": "Strong structure. Add a measurable outcome next time."}


@router.post("/chat")
def mentor_chat(payload: dict, user=Depends(get_current_user)):
    return {"reply": mentor_chat_agent(payload.get("message", ""))}
