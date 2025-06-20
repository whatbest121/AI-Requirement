import getpass
import json
import os
from typing import AsyncGenerator
from dotenv import load_dotenv
from mongo.model.modelUser import HistoryConversation
from services.langchain_module import MongoChatMessageHistory
from mongo.model.conversation import ConversationRespond, Message
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, AnyMessage , SystemMessage
from datetime import datetime
from mongo.database import conversation_collection
from bson import json_util
load_dotenv()
api_key = os.environ.get("OPENAI_API_KEY")
base_url = os.environ.get("OPENAI_BASE_URL")

async def OpenAIStream(messages: list[Message], conversation_id ) -> AsyncGenerator[str, None]:
    chat = []
    for lang in messages:
        role = lang["role"]
        if role == "user":
            chat.append(HumanMessage(content=lang["content"]))
        elif role == "assistant":
            chat.append(AIMessage(content=lang["content"]))
        elif role == "system":
            chat.append(SystemMessage(content=lang["content"]))
        else: 
            print("--raw--", lang)
    llm = ChatOpenAI(
        model="gpt-4.1-mini",
        api_key=api_key,
        base_url=base_url,
        temperature=0,
        stream_usage=True,
    )
    newMessage = ""
    async for chunk in llm.astream(chat):
        newMessage += chunk.content
        
        if chunk.response_metadata.get("finish_reason", False):
            data = {
            "role": "assistant",
            "content": newMessage,
            "timestamp": chunk.timestamp.isoformat() if hasattr(chunk, 'timestamp') else datetime.now().isoformat()
        }
            MongoChatMessageHistory(conversation_id, conversation_collection).add_messages_conversation([data])
        
        yield json.dumps({
            "content": chunk.content,
            "conversation_id": conversation_id
        }, ensure_ascii=False) + "\n"

async def historyConversation (user_id:str):
    result = conversation_collection.find({"user_id":user_id }).sort("creatAt", -1)

    data =[]
    async for history in result:
        data.append(ConversationRespond(
            id=str(history["_id"]),
            user_id=str(history["user_id"]),
            conversation_id=history["conversation_id"],
            messages=history.get("messages", []),
        ))
    
    return data

async def historyChat (input:HistoryConversation):
    document = await conversation_collection.find_one({"user_id":input.user_id, "conversation_id":input.conversation_id })
    return json.loads(json_util.dumps(document))




