import os
from dotenv import load_dotenv
from langchain_upstage import ChatUpstage
from langchain_core.prompts import ChatPromptTemplate
from backend.prompts.templates import PROMPTS

# .env 파일 로드
load_dotenv()

class ToneConverter:
    def __init__(self):
        # Upstage Solar 모델 설정
        # PRD 명세에 따라 Solar-Pro2 모델 사용 (API 상의 모델명 확인 필요, 여기서는 'solar-pro' 사용)
        self.llm = ChatUpstage(model="solar-pro")

    async def convert(self, text: str, target_audience: str) -> str:
        """
        입력된 텍스트를 대상에 맞는 말투로 변환합니다.
        """
        system_prompt = PROMPTS.get(target_audience, PROMPTS["team"])
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{text}")
        ])
        
        # LangChain Expression Language (LCEL) 사용
        chain = prompt | self.llm
        
        try:
            response = await chain.ainvoke({"text": text})
            return response.content
        except Exception as e:
            print(f"Error calling Upstage API: {e}")
            raise e

# 싱글톤 인스턴스 생성
tone_converter = ToneConverter()
