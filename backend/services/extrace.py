import os

from langchain_openai import ChatOpenAI

from mongo.model.conversation import ExtractedInfo


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
    api_key = os.environ.get("OPENAI_API_KEY")
    llm = ChatOpenAI(
        model="gpt-4.1-mini",
        api_key=api_key,
        base_url=base_url,
        temperature=0,
    ).with_structured_output(ExtractedInfo, include_raw=True)

    res = llm.invoke(prompt)
    data:ExtractedInfo = res.get("parsed")
    return data.model_dump()






