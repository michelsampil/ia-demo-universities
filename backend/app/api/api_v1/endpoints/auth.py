from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import Token, UserCreate, UserLogin
from app.crud.auth import login_or_create_user
from app.core.security import create_access_token
from app.models.user import User
from pydantic import ValidationError

router = APIRouter()

@router.post("/signup", response_model=Token)
async def login_or_sign_up(request: Request, db: Session = Depends(get_db)):
    try:
        jsonData = await request.json()
        print(f"Received JSON data: {jsonData}")

        # Try to parse the request as UserLogin
        user_login = UserLogin(**jsonData)
        print(f"Parsed UserLogin: {user_login}")

        # Check if the user exists in the database
        db_user = db.query(User).filter(User.email == user_login.email).first()
        print(f"Database user: {db_user}")

        if db_user:
            # Existing user, return token
            access_token = create_access_token(data={"user": db_user.email})
            return {"access_token": access_token, "token_type": "bearer"}
            
        user_create = UserCreate(**jsonData)
        print(f"🍔 user_create: {user_create}")

        if user_create:
            # New user, create user and return token
            new_user = User(
                email=user_create.email,
                full_name=user_create.full_name,
                degree_program=user_create.degree_program,
                academic_year=user_create.academic_year,
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            access_token = create_access_token(data={"user": new_user.email})
            return {"access_token": access_token, "token_type": "bearer"}

    except: raise HTTPException(
        status_code=400,
        detail="User not found or no sufficient data to create a new user."
    )
