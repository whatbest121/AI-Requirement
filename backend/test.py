import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

from mongo.model.conversation import ExtractedInfo
load_dotenv()
api_key = os.environ.get("OPENAI_API_KEY")
base_url = os.environ.get("OPENAI_BASE_URL")
message = "hi"
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

print(f"กำลังวิเคราะห์ข้อความ: {message}")
res = llm.invoke(prompt)
print("----", res)
data: ExtractedInfo = res
