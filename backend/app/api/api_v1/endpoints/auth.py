from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import UserCreate, Token
from app.crud.auth import login_or_create_user
from app.core.security import create_access_token

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_or_sign_up(user: UserCreate, db: Session = Depends(get_db)):
    db_user = login_or_create_user(db, user)
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}
