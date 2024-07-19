from sqlalchemy.orm import Session
from app.models.score import Score as ScoreModel
from app.schemas.score import ScoreCreate

def create_score(db: Session, score: ScoreCreate) -> ScoreModel:
    db_score = ScoreModel(**score.dict())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def get_top_scores(db: Session, limit: int = 10):
    return db.query(ScoreModel).order_by(ScoreModel.value.desc()).limit(limit).all()
