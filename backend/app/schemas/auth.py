from pydantic import BaseModel

class UserCreate(BaseModel):
    full_name: str
    email: str
    degree_program: str
    academic_year: int

class UserLogin(BaseModel):
    email: str

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
