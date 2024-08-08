# app/models/score.py

from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import Base

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    value = Column(Integer)
    date = Column(String)
    position = Column(Integer, index=True)
    timestamp = Column(DateTime, index=True)
