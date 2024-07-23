from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    full_name: str
    email: EmailStr  # Ensures email validation

class UserCreate(UserBase):
    # Removed password field as it's no longer needed
    pass

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True  # Allows compatibility with ORM models

# Removed UserInDB schema as hashed_password is no longer used
