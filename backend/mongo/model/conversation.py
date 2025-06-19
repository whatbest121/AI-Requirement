from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from uuid import uuid4


class Message(BaseModel):
    role: str = Field(default="user")  # 'user' or 'ai'
    content: str = Field(default="hi")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ConversationInput(BaseModel):
    conversation_id: Optional[str] = Field(default_factory=lambda: str(uuid4()))
    content: str

class Conversation(BaseModel):
    user_id: str
    conversation_id: Optional[str] = Field(default_factory=lambda: str(uuid4()))
    messages: List[Message]

class ExtractedInfo(BaseModel):
    COMPANY_PROFILE: Optional[str] = Field(
        default=None,
        description="ข้อมูลภาพรวมของบริษัท เช่น ชื่อบริษัท ขนาดองค์กร ประเภทอุตสาหกรรม ผลิตภัณฑ์หรือบริการหลัก"
    )
    
    BUSINESS_PROBLEM: Optional[List[str]] = Field(
        default=None,
        description="รายการของปัญหาทางธุรกิจที่บริษัทกำลังเผชิญ เช่น ค่าใช้จ่ายสูง การดำเนินงานไม่มีประสิทธิภาพ การแข่งขันในตลาด"
    )
    
    BUDGET: Optional[str] = Field(
        default=None,
        description="ข้อมูลเกี่ยวกับงบประมาณ เช่น ตัวเลขงบประมาณที่ตั้งไว้ หรือข้อจำกัดทางการเงิน"
    )
    
    PURPOSE_OF_PROJECTS: Optional[str] = Field(
        default=None,
        description="วัตถุประสงค์หรือเป้าหมายหลักของโครงการ เช่น การเพิ่มประสิทธิภาพ ลดต้นทุน หรือการพัฒนาผลิตภัณฑ์ใหม่"
    )