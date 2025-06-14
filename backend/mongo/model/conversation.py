from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from uuid import uuid4

class Message(BaseModel):
    role: str = Field(default="user")  # 'user' or 'ai'
    content: str = Field(default="hi")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Conversation(BaseModel):
    user_id: str
    concversation_id: Optional[str] = Field(default_factory=lambda: str(uuid4()))
    messages: List[Message]