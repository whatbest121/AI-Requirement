from datetime import datetime
from typing import Optional
from uuid import uuid4
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from pydantic import Field
from pypdf import PdfReader
from auth import get_current_active_user
from services import ai
from services.aiChat import aiStream
from mongo.model.modelUser import HistoryChat, HistoryConversation
from mongo.model.conversation import Conversation, ConversationInput
from services.ai import OpenAIStream, historyChat, historyConversation
from services.extrace import extracBus, update_extracted_info_if_applicable
from services.langchain_module import MongoChatMessageHistory
from mongo.database import conversation_collection

router = APIRouter(prefix="/ai", tags=["Ai"])


@router.post("/chatStream")
async def chat_stream(conversation_input: ConversationInput, current_user: dict = Depends(get_current_active_user)):
    conversation = Conversation(
        user_id=str(current_user["_id"]),
        conversation_id=conversation_input.conversation_id,
        messages=[{
            "role": "user",
            "content": conversation_input.content,
            "timestamp": datetime.now()
        }]
    )
    messages = await aiStream(conversation)
    return StreamingResponse(OpenAIStream(messages, conversation.conversation_id), media_type="text/event-stream")

@router.post("/upload-pdf/")
async def upload_pdf(
    file: UploadFile = File(...),
    conversation_id: Optional[str] = Form(default_factory=lambda: str(uuid4())),
    content: Optional[str] = Form(default_factory=lambda: str("")),
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
    conversation = Conversation(
        user_id=str(current_user["_id"]),
        conversation_id=conversation_id,
        messages=[{
            "role": "user",
            "content": content,
            "timestamp": datetime.now()
        }]
    )   
    messages = await aiStream(conversation)
    return StreamingResponse(OpenAIStream(messages, conversation.conversation_id), media_type="text/event-stream")


@router.get("/historyConversation")
async def historyConversations(current_user: dict = Depends(get_current_active_user)) :
    user_id = str(current_user["_id"])
    return await historyConversation(user_id)

@router.post("/historyChat")
async def historyChats(body: HistoryChat,current_user: dict = Depends(get_current_active_user)) :
    user_id = str(current_user["_id"])
    historyConversation = HistoryConversation(
        conversation_id=body.conversation_id,
        user_id=user_id
    )
    return await historyChat(historyConversation)