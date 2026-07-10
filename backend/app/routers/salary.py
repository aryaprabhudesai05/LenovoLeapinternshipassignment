from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.ai.agents import salary_prediction_agent

router = APIRouter(prefix="/salary", tags=["Salary"])


@router.post("/predict")
def predict(payload: dict, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return salary_prediction_agent(payload)
