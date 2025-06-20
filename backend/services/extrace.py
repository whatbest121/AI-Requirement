import os
from typing import List
from mongo.database import  conversation_collection
from langchain_openai import ChatOpenAI
from mongo.model.conversation import ExtractedInfo
api_key = os.environ.get("OPENAI_API_KEY")
base_url = os.environ.get("OPENAI_BASE_URL")

def extracBus(document:str):
    prompt  = f"""
คุณคือผู้เชี่ยวชาญในการสกัดข้อมูลจากเอกสารทางธุรกิจ

กรุณาวิเคราะห์เนื้อหาและแยกข้อมูลออกเป็น 4 หมวดหมู่ ดังต่อไปนี้:
1. COMPANY_PROFILE - ข้อมูลเกี่ยวกับบริษัท เช่น ขนาด อุตสาหกรรม ผลิตภัณฑ์หลัก
2. BUSINESS_PROBLEM - ปัญหาทางธุรกิจที่กำลังเผชิญ
3. BUDGET - งบประมาณที่เกี่ยวข้องหรือมีการกล่าวถึง
4. PURPOSE_OF_PROJECTS - วัตถุประสงค์ของโครงการ หรือผลลัพธ์ที่ต้องการ

หากไม่มีข้อมูลในบางหมวด ให้ตอบว่า `null`

เอกสาร:
----------------
{document}
----------------

ตอบกลับในรูปแบบ JSON ที่ตรงกับโครงสร้างนี้:
{{
  "COMPANY_PROFILE": string | null,
  "BUSINESS_PROBLEM": [string] | null,
  "BUDGET": string | null,
  "PURPOSE_OF_PROJECTS": string | null
}}
"""
  
    llm = ChatOpenAI(
        model="gpt-4.1-mini",
        api_key=api_key,
        base_url=base_url,
        temperature=0,
    ).with_structured_output(ExtractedInfo, include_raw=True)

    res = llm.invoke(prompt)
    print(res)
    data:ExtractedInfo = res.get("parsed")
    return data.model_dump()


async def identify_updated_field(message: str) -> List[dict]:
    prompt = f"""
ต่อไปนี้คือข้อความจากผู้ใช้:

\"{message}\"

โปรดวิเคราะห์ว่าข้อความนี้เกี่ยวข้องกับหมวดหมู่ข้อมูลใดต่อไปนี้:
- COMPANY_PROFILE
- BUSINESS_PROBLEM
- BUDGET
- PURPOSE_OF_PROJECTS

หากมีข้อมูล ให้ตอบกลับในรูปแบบ JSON เช่น:
{{
  "COMPANY_PROFILE": "xxx",
  "BUSINESS_PROBLEM": ["xxx"],
  "BUDGET": "xxx",
  "PURPOSE_OF_PROJECTS": "xxx"
}}

ถ้าไม่มีข้อมูลในบางหมวดหมู่ ให้ใช้ค่า `null`
"""

    llm = ChatOpenAI(
        model="gpt-4.1-mini",
        api_key=api_key,
        base_url=base_url,
        temperature=0,
    ).with_structured_output(ExtractedInfo)

    try:
        print(f"กำลังวิเคราะห์ข้อความ: {message}")
        res = llm.invoke(prompt)
        print("----", res)
        data: ExtractedInfo = res

        print("ข้อมูลที่สกัดได้:", data)

        field_infos = []
        if data.COMPANY_PROFILE:
            field_infos.append({ "field": "COMPANY_PROFILE", "value": data.COMPANY_PROFILE })
        if data.BUSINESS_PROBLEM:
            field_infos.append({ "field": "BUSINESS_PROBLEM", "value": "; ".join(data.BUSINESS_PROBLEM) })
        if data.BUDGET:
            field_infos.append({ "field": "BUDGET", "value": data.BUDGET })
        if data.PURPOSE_OF_PROJECTS:
            field_infos.append({ "field": "PURPOSE_OF_PROJECTS", "value": data.PURPOSE_OF_PROJECTS })

        return field_infos if field_infos else None
    except Exception as e:
        print("LLM parsing error:", e)
        return None

async def update_extracted_info_if_applicable(
    conversation_id: str, user_message: str
):
    field_infos = await identify_updated_field(user_message)
    if not field_infos:
        print("ไม่พบข้อมูลที่สามารถอัปเดตได้จากข้อความนี้")
        return None

    for field_info in field_infos:
        field = field_info["field"]
        value = field_info["value"]

        await conversation_collection.update_one(
            {"conversation_id": conversation_id},
            {"$set": {f"extracted_info.{field}": value}},
            upsert=True
        )
        print(f"อัปเดต {field} เรียบร้อย: {value}")
    
    return [f["field"] for f in field_infos]


