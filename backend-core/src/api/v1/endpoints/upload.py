from typing import Any
from fastapi import APIRouter, UploadFile, File
import shutil
import os
from uuid import uuid4

router = APIRouter()

# ✅ 이미지 업로드 API
# 최종 주소: /api/v1/utils/upload/image
@router.post("/upload/image")
async def upload_image(file: UploadFile = File(...)) -> Any:
    """
    이미지 파일을 받아서 서버의 static/images 폴더에 저장하고 URL을 반환합니다.
    """
    # 1. 저장할 폴더 확인 (없으면 생성)
    UPLOAD_DIR = "src/static/images"
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # 2. 파일명 중복 방지를 위해 UUID 사용
    file_extension = file.filename.split(".")[-1]
    new_filename = f"{uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)

    # 3. 파일 저장
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 4. 접근 가능한 URL 반환
    # (주의: localhost:8000은 개발 환경용. 배포 시 도메인으로 변경 필요)
    return {"url": f"http://localhost:8000/static/images/{new_filename}"}