from mongo.model.conversation import Message
from datetime import datetime
from mongo.database import conversation_collection

async def add_message(session_id: str, role: str, content: str):
    message = {
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow()
    }

    await conversation_collection.update_one(
        {"session_id": session_id},
        {"$push": {"messages": message}},
        upsert=True
    )

async def get_conversation(session_id: str):
    return await conversation_collection.find_one({"session_id": session_id})