from sqlalchemy.orm import Session
from app.models.question import Question as QuestionModel
from app.schemas.question import QuestionCreate

def create_question(db: Session, question: QuestionCreate):
    db_question = QuestionModel(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def get_question_by_id(db: Session, question_id: int):
    return db.query(QuestionModel).filter(QuestionModel.id == question_id).first()

def get_random_question(db: Session):
    return db.query(QuestionModel).order_by(func.random()).first()
