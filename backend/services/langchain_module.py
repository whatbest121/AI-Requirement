from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import BaseMessage
from pymongo.collection import Collection
from mongo.model.conversation import Message
from bson import ObjectId
import json

class MongoChatMessageHistory(BaseChatMessageHistory):
    def __init__(self, concversation_id: str, collection: Collection):
        self.concversation_id = concversation_id
        self.collection = collection

    # @property
    # def messages(self) -> list[BaseMessage]:
    #     doc = self.collection.find_one({"concversation_id": self.concversation_id})
    #     if not doc:
    #         return []
    #     return [BaseMessage.parse_raw(m) for m in doc["messages"]]

    def add_messages(self, messages: list[list[Message]] ) -> None:
        # print(messages[0][0])
        self.collection.update_one(
            {"concversation_id": self.concversation_id},
            {"$push": {"messages": {"$each": messages[0]}}},
            upsert=True
        )
        print(f"Adding messages to conversation {self.concversation_id}: {messages}")

    def clear(self) -> None:
        self.collection.update_one(
            {"concversation_id": self.concversation_id},
            {"$set": {"messages": []}},
            upsert=True
        )
