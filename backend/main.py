import sys
import os
from typing import Optional
from uuid import uuid4

from fastapi.responses import StreamingResponse
from pypdf import PdfReader
from services.extrace import extracBus, update_extracted_info_if_applicable
from services.ai import OpenAIStream
from services.langchain_module import MongoChatMessageHistory
from mongo.model.conversation import Conversation, ConversationInput
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, File, Form, HTTPException, Depends, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from config import settings
from mongo.database import connect_to_mongo, close_mongo_connection, database, conversation_collection
from routes import api_router
from auth import get_current_active_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="Backend API with JWT Auth",
    description="FastAPI backend with MongoDB and JWT authentication - Modular Structure",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.environment == "development" else ["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Welcome to FastAPI Backend with JWT Auth",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    try:
        await database.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "environment": settings.environment
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")

@app.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_active_user)):
    return {
        "message": f"Hello {current_user['username']}, this is a protected route!",
        "user_id": str(current_user["_id"]),
        "access_level": "authenticated"
    }

@app.post("/chatStream")
async def chat_stream(conversation_input: ConversationInput, current_user: dict = Depends(get_current_active_user)):
    conversation = Conversation(
        user_id=str(current_user["_id"]),
        conversation_id=conversation_input.conversation_id,
        messages=conversation_input.messages
    )

    conv_id = conversation.conversation_id
    user_msg = conversation.messages[-1].content

    result = await conversation_collection.find_one({"conversation_id": conv_id})
    if not result:
        await conversation_collection.insert_one({
            "conversation_id": conv_id,
            "user_id": conversation.user_id,
            "messages": [],
            "extracted_info": {
                "COMPANY_PROFILE": None,
                "BUSINESS_PROBLEM": None,
                "BUDGET": None,
                "PURPOSE_OF_PROJECTS": None
            }
        })
        result = await conversation_collection.find_one({"conversation_id": conv_id})

    await update_extracted_info_if_applicable(conv_id, user_msg)

    result = await conversation_collection.find_one({"conversation_id": conv_id})
    extracted_info = result.get("extracted_info", {})

    missing_info = []
    if not extracted_info.get("COMPANY_PROFILE"):
        missing_info.append("ข้อมูลบริษัท")
    if not extracted_info.get("BUSINESS_PROBLEM"):
        missing_info.append("ปัญหาทางธุรกิจ")
    if not extracted_info.get("BUDGET"):
        missing_info.append("งบประมาณ")
    if not extracted_info.get("PURPOSE_OF_PROJECTS"):
        missing_info.append("วัตถุประสงค์ของโครงการ")

    system_message = "คุณคือผู้ช่วย AI ที่จะช่วยวิเคราะห์และให้คำแนะนำเกี่ยวกับโครงการ"
    if missing_info:
        system_message += f"\n\nข้อมูลที่ยังขาด: {', '.join(missing_info)}"
        system_message += "\nกรุณาให้ข้อมูลเพิ่มเติมในส่วนที่ขาดหายไป"
    else:
        system_message = "ข้อมูลทั้งหมดครบถ้วนแล้ว สิ้นสุดการเก็บ Requirment"

    messages = result.get("messages", [])
    messages += [conversation.messages[-1].model_dump()]
    messages += [{
        "role": "system",
        "content": system_message,
        "timestamp": None
    }]

    MongoChatMessageHistory(conv_id, conversation_collection).add_messages_conversation(conversation.messages)
    return StreamingResponse(OpenAIStream(messages, conv_id), media_type="text/event-stream")

@app.post("/upload-pdf/")
async def upload_pdf(
    file: UploadFile = File(...),
    conversation_id: Optional[str] = Form(default_factory=lambda: str(uuid4())),
    current_user: dict = Depends(get_current_active_user)
):
    user_id = str(current_user["_id"])
    contents = await file.read()
    
    try:
        from io import BytesIO
        pdf_reader = PdfReader(BytesIO(contents))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
    except Exception as e:
        return {"error": str(e)}

    extracted_info = extracBus(text)

    if conversation_id:
        await conversation_collection.update_one(
            {"conversation_id": conversation_id},
            {
                "$set": {
                    "user_id": user_id,
                    "extracted_info": extracted_info
                }
            },
            upsert=True
        )

    return {
        "filename": file.filename,
        "user_id": user_id,
        "conversation_id": conversation_id,
        "extracted_text": text,
        "extracted_info": extracted_info
    }

#fff
# if __name__ == "__main__":
#     uvicorn.run(
#         "main:app",
#         host=settings.host,
#         port=settings.port,
#         reload=settings.environment == "development"
#     )
