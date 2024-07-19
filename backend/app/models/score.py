from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    value = Column(Integer)
