from fastapi import APIRouter, HTTPException
from models.schemas import ConvertRequest, ConvertResponse
from services.tone_converter import converter

router = APIRouter()

@router.post("/convert", response_model=ConvertResponse)
async def convert_tone(request: ConvertRequest):
    try:
        if not request.text.strip():
            raise HTTPException(status_code=422, detail="text 필드는 필수이며 비어 있을 수 없습니다.")

        converted_text = await converter.convert(request.text, request.target_audience)
        
        return ConvertResponse(
            converted_text=converted_text,
            target_audience=request.target_audience,
            original_text=request.text
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        # 실제 운영 환경에서는 에러 로그를 남겨야 합니다.
        raise HTTPException(status_code=500, detail=f"LLM API 호출 중 오류가 발생했습니다: {str(e)}")
