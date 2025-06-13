# routes/auth.py
from fastapi import APIRouter, Response
from models import UserCreate, UserLogin, UserResponse
from services.auth import register_user_service, login_user_service
from config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    return await register_user_service(user)

@router.post("/login")
async def login(user_credentials: UserLogin, response: Response):
    access_token, user = await login_user_service(user_credentials)

    # ✅ Set JWT in cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=60 * settings.access_token_expire_minutes,
        secure=settings.environment != "development",
        samesite="lax",
        path="/"
    )

    return {"message": "Login successful", "username": user["username"], "token":access_token}
