from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.ai.agents import career_analysis_agent

router = APIRouter(prefix="/career", tags=["Career"])


@router.post("/analyze")
def analyze(payload: dict, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return career_analysis_agent(payload.get("skills", []), payload.get("target_role", ""))
