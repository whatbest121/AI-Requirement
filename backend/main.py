import sys
import os

from fastapi.responses import StreamingResponse

from services.ai import OpenAI, OpenAIStream
from services.langchain_module import MongoChatMessageHistory
from mongo.model.conversation import Conversation
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException, Depends
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
@app.post("/chat")
async def chat_stream(conversation : Conversation):
    MongoChatMessageHistory(conversation.concversation_id, conversation_collection).add_messages_conversation(conversation.messages)
    content = await OpenAI(conversation.messages)
    MongoChatMessageHistory(conversation.concversation_id, conversation_collection).add_messages_conversation([content])
    return  content.get("content", None)


@app.post("/chatStream")
async def chat_stream(conversation: Conversation):
    result = await conversation_collection.find_one({"concversation_id": conversation.concversation_id})
    newMessages = []
    if result:
        newMessages = result.get("messages", [])
        newMessages += [conversation.messages[-1].model_dump()]
    else:
        newMessages = [conversation.messages[-1].model_dump()]
    MongoChatMessageHistory(conversation.concversation_id, conversation_collection).add_messages_conversation(conversation.messages)
    return StreamingResponse(OpenAIStream(newMessages, conversation.concversation_id), media_type="text/event-stream")


# if __name__ == "__main__":
#     uvicorn.run(
#         "main:app",
#         host=settings.host,
#         port=settings.port,
#         reload=settings.environment == "development"
#     )
