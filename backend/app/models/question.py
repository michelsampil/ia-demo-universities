from sqlalchemy import Column, Integer, String, JSON
from app.db.database import Base

class Question(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True, index=True)
    options = Column(JSON)
    category = Column(String)
    image = Column(String)
    correct_answer = Column(String)  # Assuming you need a correct answer field
