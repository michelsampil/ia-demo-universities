# app/schemas/score.py

from pydantic import BaseModel
from typing import Optional

class ScoreBase(BaseModel):
    value: int
    date: str

class ScoreCreate(ScoreBase):
    pass

class Score(ScoreBase):
    id: int

    class Config:
        orm_mode = True
