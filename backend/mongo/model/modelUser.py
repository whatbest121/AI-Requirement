from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class HistoryConversation(BaseModel):
    user_id:str
    conversation_id:str

class HistoryChat(BaseModel):
    conversation_id:str

class UserResponse(BaseModel):
    id: str
    username: str
    is_active: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class APIResponse(BaseModel):
    message: str
    data: Optional[dict] = None
    status: str = "success"