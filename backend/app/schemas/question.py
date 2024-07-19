from pydantic import BaseModel
from typing import Optional

class QuestionBase(BaseModel):
    text: str
    answer: str

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int

    class Config:
        orm_mode = True
