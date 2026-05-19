from fastapi import APIRouter, HTTPException
from backend.models.schemas import ConvertRequest, ConvertResponse
from backend.services.tone_converter import tone_converter

router = APIRouter()

@router.post("/convert", response_model=ConvertResponse)
async def convert_text(request: ConvertRequest):
    """
    사용자의 텍스트를 입력받아 선택된 수신 대상에 맞는 말투로 변환합니다.
    """
    if not request.text.strip():
        raise HTTPException(status_code=422, detail="text 필드는 필수이며 비어있을 수 없습니다.")
    
    try:
        converted = await tone_converter.convert(request.text, request.target_audience)
        return ConvertResponse(
            converted_text=converted,
            target_audience=request.target_audience,
            original_text=request.text
        )
    except Exception as e:
        # PRD에 따라 500 에러 처리
        raise HTTPException(status_code=500, detail=f"LLM API 호출 중 오류가 발생했습니다: {str(e)}")
