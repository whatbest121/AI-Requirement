from fastapi import APIRouter
from .auth_router import router as auth_router
from .users import router as users_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)