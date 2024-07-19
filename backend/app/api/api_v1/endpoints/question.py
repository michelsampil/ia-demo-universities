from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.question import Question, QuestionCreate
from app.crud.question import create_question, get_question_by_id, get_random_question

router = APIRouter()

@router.post("/", response_model=Question)
async def create_new_question(question: QuestionCreate, db: Session = Depends(get_db)):
    return create_question(db, question)

@router.get("/{question_id}", response_model=Question)
async def get_question(question_id: int, db: Session = Depends(get_db)):
    question = get_question_by_id(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.get("/random", response_model=Question)
async def get_random(db: Session = Depends(get_db)):
    question = get_random_question(db)
    if not question:
        raise HTTPException(status_code=404, detail="No questions available")
    return question
