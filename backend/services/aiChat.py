

from backend.mongo.model import conversation
from backend.services.extrace import update_extracted_info_if_applicable
from backend.services.langchain_module import MongoChatMessageHistory
from mongo.database import conversation_collection
from datetime import datetime

async def aiStream (conversation: conversation.Conversation):
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
            },
            "creatAt": datetime.now()
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

    return messages