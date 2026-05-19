# 업무 말투 변환기 (BizTone Converter) - 프로젝트 지침서

## 프로젝트 개요
**업무 말투 변환기**는 사용자가 입력한 내용을 상사, 동료, 고객 등 수신 대상에 적합한 비즈니스 말투로 자동 변환해주는 서비스입니다.
- **주요 기술:** Python (FastAPI), LangChain, Upstage Solar-Pro2 LLM, Vanilla HTML/CSS/JS.
- **아키텍처:** 클라이언트-서버 구조. 프론트엔드(Vanilla JS)가 백엔드(FastAPI)와 통신하며, 백엔드는 LangChain을 통해 Upstage AI 모델을 호출합니다.

## 디렉토리 구조
- `backend/`: FastAPI 애플리케이션 소스.
  - `models/`: 요청/응답 데이터 검증을 위한 Pydantic 스키마.
  - `prompts/`: 수신 대상별 시스템 프롬프트 템플릿.
  - `routers/`: API 엔드포인트 정의 (예: `/api/convert`).
  - `services/`: LLM 연동 및 말투 변환 핵심 로직.
- `frontend/`: 정적 웹 파일.
  - `css/`: 스타일시트.
  - `js/`: 프론트엔드 로직 (UI 이벤트 처리, API 호출).
- `개요서_업무말투변환기.md`: 프로그램 전체 개요 및 목적.
- `PRD_업무말투변환기.md`: 기술 명세 및 단계별 구현 방법이 담긴 제품 요구사항 명세서.

## 빌드 및 실행 방법

### 백엔드 (Backend)
1. **환경 설정:**
   - Python 3.11 이상이 설치되어 있어야 합니다.
   - 의존성 설치: `pip install -r backend/requirements.txt`
   - `backend/` 디렉토리에 `UPSTAGE_API_KEY`가 포함된 `.env` 파일을 생성합니다.
2. **서버 실행:**
   - 명령어: `uvicorn main:app --reload` (참고: PRD에 따라 백엔드 루트에 `main.py` 생성이 필요합니다).

### 프론트엔드 (Frontend)
- 브라우저에서 `frontend/index.html`을 직접 열거나, VS Code의 Live Server 등을 사용하여 실행합니다.

## 개발 규칙 (바이브 코딩 3원칙)
- **원칙 1: 완료 기준을 먼저 정의하라.** 구현을 시작하기 전에 반드시 체크리스트를 작성합니다.
- **원칙 2: 조사 먼저, 구현 나중.** 코드를 짜기 전에 API 사용법, 패키지 버전 등을 먼저 파악합니다.
- **원칙 3: 버그는 분석 먼저, 수정 나중.** 에러 발생 시 수정을 서두르지 말고 근본 원인을 먼저 분석합니다.
- **보안:** `.env` 파일은 절대로 Git에 커밋하지 않습니다. `.gitignore`에 등록되어 있는지 항상 확인하세요.
- **스타일:** 프로젝트 기본 설정에 따라 스타일링에는 Vanilla CSS 사용을 권장합니다.

## 할 일 목록 (TODOs)
- [ ] `backend/main.py` 구현
- [ ] `backend/routers/convert.py` 내 API 엔드포인트 구현
- [ ] `backend/services/tone_converter.py` 내 변환 로직 구현
- [ ] `frontend/index.html` 및 관련 에셋 생성

** 참고 문서 **
- [개요서_업무말투변환기.md](./개요서_업무말투변환기.md): 프로젝트의 목적과 비전, 핵심 기능에 대한 개요.
- [PRD_업무말투변환기.md](./PRD_업무말투변환기.md): 기술 스택, 상세 기능 요구사항, API 명세 및 단계별 구현 가이드.



### Source Code가 변경되거나, 라이브러리 버전이 변경되면 반드시 @PRD_업무말투변환기.md 문서도 반드시 같이 업데이트 합니다.
* 구현이 완료된 사항들은 완료 체크리스트에 모두 체크표시를 해서 완료되었음을 표시하세요.
