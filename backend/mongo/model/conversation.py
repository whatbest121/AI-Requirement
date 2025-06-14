from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

class Message(BaseModel):
    role: str = Field(default="user")  # 'user' or 'ai'
    content: str = Field(default="hi")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Conversation(BaseModel):
    user_id: str
    concversation_id: str
    messages: List[Message]