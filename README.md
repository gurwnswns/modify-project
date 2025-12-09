# MODIFY Project - AI 기반 패션 쇼핑몰 (Profile & Signup Update)

## 작업 일지 (2025.12.09)

#### 1. 회원가입 및 로그인 (Authentication)

- **UI/UX 개선:** \* 로그인 화면: 좌측 폼 + 우측 패션 화보의 **Split Layout** 적용.
  - 회원가입 화면: 중앙 집중형 **Card Layout**으로 전환 및 2열 그리드 배치로 가독성 향상.
- **정보 확장:** \* 기존 이메일/비번 외에 **이름, 생년월일, 주소, 전화번호, Location** 등 사용자 정보 필드 대폭 확장.
  - 백엔드 DB Schema(`User`) 및 Pydantic Model(`UserCreate`) 업데이트 완료.

#### 2. 프로필 관리 (Profile Management)

- **프로필 편집 모달:**
  - 페이지 이동 없이 **팝업(Modal)** 형태의 편집 화면 구현.
  - **프로필 사진 변경/삭제:** 이미지 업로드 API 연동 및 미리보기(Preview) 기능.
  - **UX 애니메이션:** 모달 진입 시 상단 **게이지 바(Gauge Bar)**가 차오르는 애니메이션 효과 적용.
  - **삭제 기능:** 휴지통 아이콘을 통해 프로필 사진을 기본 이미지(이니셜)로 초기화 가능.
- **헤더(Header) & 사이드바(Sidebar):**
  - **반응형 UI:** 로그인 시 사용자 프로필 이미지(또는 이니셜) 표시.
  - **드롭다운 메뉴:** 헤더 프로필 클릭 시 [내 프로필 관리], [로그아웃] 메뉴 제공.
  - **이름 표시 로직:** 이름이 있을 경우 뒤에서 2글자(예: "혁준")를 추출하여 아바타 내에 표시.

#### 3. 백엔드 시스템 (Backend System)

- **이미지 업로드 API:** `upload.py` 엔드포인트 생성 (`/api/v1/utils/upload/image`).
- **정적 파일 서빙:** `src/static/images` 폴더를 마운트하여 업로드된 이미지를 URL로 접근 가능하게 설정.
- **DB 마이그레이션:** `Alembic`을 사용하여 `users` 테이블에 `profile_image`, `address` 등 신규 컬럼 추가.
- **메서드 최적화:** 회원 정보 부분 수정을 위해 `PUT` 대신 **`PATCH`** 메서드 도입.

---

### 트러블슈팅 (Troubleshooting Log)

오늘 개발 과정에서 발생한 주요 이슈와 해결 방법입니다.

#### 1. Docker 환경 내 파일 동기화 및 404 에러

- **문제:** 백엔드에 새로운 API 파일(`upload.py`)을 추가하고 `__init__.py`에 등록했으나, Swagger 및 프론트엔드에서 `404 Not Found` 발생.
- **원인:** Docker Container가 기존 이미지를 캐싱하고 있어, 새로운 파일 구조와 라우터 설정을 즉시 반영하지 못함.
- **해결:** 단순 재시작(`restart`)이 아닌, `--build --force-recreate` 옵션을 사용하여 컨테이너를 강제로 재빌드하여 해결.

#### 2. API 통신 메서드 불일치 (405 Error)

- **문제:** 프로필 수정 시 `405 Method Not Allowed` 에러 발생.
- **원인:** 백엔드 API는 `@router.patch`로 정의되었으나, 프론트엔드에서 `client.put`으로 요청을 보냄.
- **해결:** 프론트엔드 요청 메서드를 `client.patch`로 수정하여 RESTful 규격을 맞춤.

#### 3. 정적 파일(Image) 엑박 현상

- **문제:** 이미지는 업로드되었으나 브라우저에서 접근 시 깨져서 보임.
- **원인:** FastAPI의 `StaticFiles` 마운트 경로가 실제 저장 경로(`src/static`)가 아닌 루트의 `static`으로 잘못 매핑됨.
- **해결:** `app.mount("/static", StaticFiles(directory="src/static"), ...)` 으로 경로를 명확히 지정.

# 백엔드 컨테이너 내부에서 alembic 실행

docker-compose -f docker-compose.dev.yml exec backend-core alembic upgrade head
