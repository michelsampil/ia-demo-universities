from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import UserCreate, UserOut
from app.crud.auth import create_user, get_user_by_id

router = APIRouter()

@router.post("/signup", response_model=UserOut)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)

@router.get("/user/{user_id}", response_model=UserOut)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
