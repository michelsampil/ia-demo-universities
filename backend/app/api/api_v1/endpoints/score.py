from typing import List  # Add this import
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud.score import create_score, get_top_scores
from app.schemas.score import Score, ScoreCreate
from app.db.database import get_db

router = APIRouter()

@router.post("/scores/", response_model=Score)
def create_score_endpoint(score: ScoreCreate, db: Session = Depends(get_db)):
    return create_score(db=db, score=score)

@router.get("/scores/top/{limit}", response_model=List[Score])  # List imported from typing
def read_top_scores(limit: int, db: Session = Depends(get_db)):
    return get_top_scores(db=db, limit=limit)
