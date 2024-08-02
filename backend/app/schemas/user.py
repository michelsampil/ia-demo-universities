from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    full_name: str
    email: EmailStr  # Ensures email validation

class UserCreate(UserBase):
    degree_program: str
    academic_year: int
    # Removed password field as it's no longer needed

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True  # Allows compatibility with ORM models

