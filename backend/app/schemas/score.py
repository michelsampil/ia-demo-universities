from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScoreBase(BaseModel):
    name: str
    email: str
    value: int
    position: Optional[int] = None
    timestamp: datetime
    elapsed_time: str

class ScoreCreate(ScoreBase):
    pass

class Score(ScoreBase):
    id: int

    class Config:
        orm_mode = True
