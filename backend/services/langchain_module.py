from typing import List
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import BaseMessage
from pymongo.collection import Collection
from mongo.model.conversation import Message
from bson import ObjectId
import json

class MongoChatMessageHistory(BaseChatMessageHistory):
    def __init__(self, conversation_id: str, collection: Collection):
        self.conversation_id = conversation_id
        self.collection = collection

    def add_messages_conversation(self, messages: List[Message]) -> None:

        def message_to_dict(msg: Message):
            d = msg.model_dump()
            if "timestamp" in d:
                d["timestamp"] = msg.timestamp.isoformat() 
            return d
        if isinstance(messages[0], Message):

            serialized_messages = [message_to_dict(m) for m in messages]
        else:
            serialized_messages = messages
        self.collection.update_one(
        {"conversation_id": self.conversation_id},
        {"$push": {"messages": {"$each": serialized_messages }}},
        upsert=True
    )
    def clear(self) -> None:
        self.collection.update_one(
            {"conversation_id": self.conversation_id},
            {"$set": {"messages": []}},
            upsert=True
        )
