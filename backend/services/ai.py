import getpass
import os
from typing import AsyncGenerator
from dotenv import load_dotenv
from services.langchain_module import MongoChatMessageHistory
from mongo.model.conversation import Message
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, AnyMessage , SystemMessage
from datetime import datetime
from mongo.database import conversation_collection
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
        
        yield chunk.content


