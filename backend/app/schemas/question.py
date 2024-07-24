from pydantic import BaseModel
from typing import List

class QuestionBase(BaseModel):
    options: List[str]
    category: str
    image: str
    correct_answer: str

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int

    class Config:
        orm_mode = True
