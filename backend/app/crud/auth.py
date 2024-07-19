# app/crud/auth.py
from sqlalchemy.orm import Session
from app.models.user import User as UserModel
from app.schemas.auth import UserCreate

def create_user(db: Session, user: UserCreate):
    db_user = UserModel(username=user.username, hashed_password=user.password)  # Adjust if your model differs
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_id(db: Session, user_id: int):
    return db.query(UserModel).filter(UserModel.id == user_id).first()
