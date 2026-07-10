from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.ai.agents import job_recommendation_agent

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/recommend")
def recommend(payload: dict, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return job_recommendation_agent(payload.get("skills", []))
