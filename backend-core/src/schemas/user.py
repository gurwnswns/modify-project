from typing import Optional
from datetime import datetime, date  # ✨ 날짜 처리를 위해 date 추가
from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
import re

# --------------------------------------------------------------------------
# 1. 공통 속성 (UserBase)
# - DB 모델과 공유하거나, 여러 스키마에서 공통으로 쓰는 필드들
# --------------------------------------------------------------------------
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    
    # ✨ [추가] 회원가입 및 프로필 관리용 공통 필드들
    phone_number: Optional[str] = None 
    birth_date: Optional[date] = None      # 생년월일 (YYYY-MM-DD)
    address: Optional[str] = None          # 주소
    zip_code: Optional[str] = None         # 우편번호
    country: Optional[str] = None          # 국가 (Location)
    is_marketing_agreed: Optional[bool] = False # 마케팅 동의 여부

# --------------------------------------------------------------------------
# 2. 회원가입 요청 스키마 (UserCreate)
# - 회원가입 할 때 프론트에서 필수/선택으로 보내는 데이터 정의
# --------------------------------------------------------------------------
class UserCreate(UserBase):
    password: str

    # 비밀번호 유효성 검사 (길이, 영문/숫자 포함 여부)
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6 or len(v) > 100:
            raise ValueError('비밀번호는 6자 이상 100자 이하이어야 합니다.')
        
        if not re.match(r"^(?=.*[A-Za-z])(?=.*\d).+$", v):
            raise ValueError('비밀번호는 영문과 숫자를 반드시 포함해야 합니다.')
            
        return v

# --------------------------------------------------------------------------
# 3. 정보 수정 요청 스키마 (UserUpdate)
# 🚨 [중요] 아까 두 개로 나뉘어 있던 걸 하나로 통합했습니다!
# - 사용자가 수정 가능한 모든 필드를 여기서 정의합니다. (모두 Optional)
# --------------------------------------------------------------------------
class UserUpdate(BaseModel): 
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_marketing_agreed: Optional[bool] = None
    
    # ✨ 연락처 및 주소 정보 (회원정보 수정용)
    phone_number: Optional[str] = None 
    birth_date: Optional[date] = None
    address: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    
    # ✨ [필수 추가] 프로필 이미지 URL (이게 있어야 사진 변경 가능!)
    profile_image: Optional[str] = None 

# --------------------------------------------------------------------------
# 4. 응답 스키마 (UserResponse)
# - 백엔드가 프론트엔드에게 데이터를 돌려줄 때 사용하는 구조
# --------------------------------------------------------------------------
class UserResponse(UserBase):
    id: int
    # UserBase를 상속받았으므로 email, phone_number, address 등은 자동으로 포함됨!
    
    provider: str = "email"
    
    # ✨ [필수 추가] 프론트엔드에 이미지 URL을 돌려줘야 새로고침 해도 사진이 유지됨!
    profile_image: Optional[str] = None 
    
    created_at: datetime 
    updated_at: datetime 
    
    # Pydantic v2 설정 (ORM 객체를 Pydantic 모델로 변환 허용)
    model_config = ConfigDict(from_attributes=True)

# --------------------------------------------------------------------------
# 5. 토큰 관련 스키마
# --------------------------------------------------------------------------
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

# 🚨 Alias 설정 (다른 파일에서 'User'라는 이름으로 쓸 수 있게 함)
User = UserResponse