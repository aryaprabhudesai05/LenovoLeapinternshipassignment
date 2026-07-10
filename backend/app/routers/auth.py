from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import create_access_token, get_current_user
from app.schemas import RegisterIn, LoginIn, TokenOut, UserOut

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenOut)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    token = create_access_token({"sub": payload.email, "email": payload.email})
    return {"access_token": token}


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    token = create_access_token({"sub": payload.email, "email": payload.email})
    return {"access_token": token}


@router.get("/me", response_model=UserOut)
def me(user=Depends(get_current_user)):
    return UserOut(uid=user["uid"], name="Arya Prabhudesai", email=user["email"])
