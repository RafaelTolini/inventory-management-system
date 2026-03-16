from pydantic import BaseModel, Field


class UserRead(BaseModel):
    id: int
    username: str = Field(min_length=1, max_length=255)

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str
    password: str
