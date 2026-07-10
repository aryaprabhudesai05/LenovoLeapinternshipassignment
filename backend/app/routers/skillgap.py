from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.ai.agents import skill_gap_agent

router = APIRouter(prefix="/skill-gap", tags=["Skill Gap"])


@router.post("/detect")
def detect(payload: dict, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return skill_gap_agent(payload.get("current", []), payload.get("required", []))
