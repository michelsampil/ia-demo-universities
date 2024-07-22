from sqlalchemy.orm import Session
from app.models.user import User as UserModel
from app.schemas.auth import UserCreate

def get_user_by_email(db: Session, email: str):
    return db.query(UserModel).filter(UserModel.email == email).first()

def create_user(db: Session, user: UserCreate):
    db_user = UserModel(full_name=user.full_name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def login_or_create_user(db: Session, user: UserCreate):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        return db_user
    return create_user(db, user)
