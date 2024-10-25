import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import Base
from datetime import datetime as dt

# models.py
class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, index=True)
    value = Column(Integer)
    position = Column(Integer)
    timestamp = Column(DateTime, default=dt.utcnow)
    elapsed_time = Column(String)  # Add this field to store elapsed time
