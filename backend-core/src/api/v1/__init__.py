from fastapi import APIRouter
from src.api.v1.endpoints import auth, users, products, search, admin
from src.api.v1.endpoints import upload  # 👈 1. 임포트 확인!

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

# 👇 2. 연결 확인! (prefix가 "/utils" 인지 꼭 확인!)
api_router.include_router(upload.router, prefix="/utils", tags=["utils"])