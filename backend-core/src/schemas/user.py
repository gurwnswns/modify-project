from typing import Optional
from datetime import datetime, date  # ✨ date 추가됨
from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
import re

# 공통 속성 (UserBase)
# 여기 추가하면 Create, Update, Response 모두에 기본적으로 들어갈 수 있어.
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    
    # ✨ [추가] 공통 필드들
    phone_number: Optional[str] = None 
    birth_date: Optional[date] = None      # 생년월일
    address: Optional[str] = None          # 주소
    zip_code: Optional[str] = None         # 우편번호
    country: Optional[str] = None          # 국가 (Location)
    is_marketing_agreed: Optional[bool] = False # 마케팅 동의

# 회원가입/생성 시 필요한 속성 (UserCreate)
class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6 or len(v) > 100:
            raise ValueError('비밀번호는 6자 이상 100자 이하이어야 합니다.')
        
        if not re.match(r"^(?=.*[A-Za-z])(?=.*\d).+$", v):
            raise ValueError('비밀번호는 영문과 숫자를 반드시 포함해야 합니다.')
            
        return v

# 업데이트 시 필요한 속성 (UserUpdate)
# 정보 수정할 때 선택적으로 바꿀 수 있게 다 Optional로 둠
class UserUpdate(BaseModel): 
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_marketing_agreed: Optional[bool] = None
    phone_number: Optional[str] = None 
    
    # ✨ [추가] 업데이트 가능한 필드들
    birth_date: Optional[date] = None
    address: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None

# DB에서 조회해서 나갈 때 쓰는 속성 (UserResponse)
class UserResponse(UserBase):
    id: int
    # UserBase를 상속받았으므로 email, full_name, phone_number 등은 이미 포함됨!
    # 추가로 응답에만 들어가는 필드들 정의
    
    provider: str = "email"
    created_at: datetime 
    updated_at: datetime 
    
    # Pydantic v2 설정
    model_config = ConfigDict(from_attributes=True)

# 로그인 시 토큰 응답 스키마
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

# 🚨 Alias 설정
User = UserResponse