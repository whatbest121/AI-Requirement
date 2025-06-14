import getpass
import os
from typing import AsyncGenerator
from dotenv import load_dotenv
from services.langchain_module import MongoChatMessageHistory
from mongo.model.conversation import Message
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, AnyMessage , SystemMessage
load_dotenv()
api_key = os.environ.get("OPENAI_API_KEY")
async def OpenAI(messages: list[Message]) -> AIMessage:
  
    # print("Loading OpenAI API key...",os.environ.get("OPENAI_API_KEY")), 
    # if not os.environ.get("OPENAI_API_KEY"):
    #     os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")
    print("API Key loaded successfully.")
    def message_to_dict(msg: Message):
            d = msg.model_dump()
            d["timestamp"] = msg.timestamp.isoformat() 
            return d

    serialized_messages = [message_to_dict(m) for m in messages]
    chat = []
    for lang in serialized_messages:
        role = lang["role"]
        if role == "user":
            chat.append(HumanMessage(content=lang["content"]))
        elif role == "assistant":
            chat.append(AIMessage(content=lang["content"]))
        elif role == "system":
            chat.append(SystemMessage(content=lang["content"]))

    llm = ChatOpenAI(
    model="gpt-4.1-mini",
    api_key=api_key,
    temperature=0,
    )
    res = llm.invoke(chat)
    
    reformat = {
        "role": res.type,
        "content": res.content,
        "timestamp": res.timestamp.isoformat() if hasattr(res, 'timestamp') else None
    }
    
    return reformat

async def OpenAIStream(messages: list[Message]) -> AsyncGenerator[str, None]:
    def message_to_dict(msg: Message):
        d = msg.model_dump()
        d["timestamp"] = msg.timestamp.isoformat()
        return d
    serialized_messages = [message_to_dict(m) for m in messages]
    chat = []
    for lang in serialized_messages:
        role = lang["role"]
        if role == "user":
            chat.append(HumanMessage(content=lang["content"]))
        elif role == "assistant":
            chat.append(AIMessage(content=lang["content"]))
        elif role == "system":
            chat.append(SystemMessage(content=lang["content"]))
    llm = ChatOpenAI(
        model="gpt-4.1-mini",
        api_key=api_key,
        temperature=0,
        stream_usage=True,
    )
    newMessage = ""
    async for chunk in llm.astream(chat):
        print("Chunk received:", chunk)
        newMessage += chunk.content
        if chunk.response_metadata.get("finish_reason", False):
            print("Stream stopped", newMessage)
            # MongoChatMessageHistory(conversation.concversation_id, conversation_collection).add_messages_conversation([content])
        
        yield chunk.content


