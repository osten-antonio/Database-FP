from pydantic import BaseModel

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username:str
    role:str
    access_token: str
    token_type: str

class ErrorResponse(BaseModel):
    detail: str

