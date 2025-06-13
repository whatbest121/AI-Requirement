# services/auth_service.py

from datetime import datetime, timedelta
from fastapi import HTTPException, status
from models import UserCreate, UserLogin, UserResponse, Token
from database import users_collection
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_user_by_username,
)
from config import settings

async def register_user_service(user: UserCreate) -> UserResponse:
    existing_user = await get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    hashed_password = get_password_hash(user.password)
    user_dict = {
        "username": user.username,
        "hashed_password": hashed_password,
        "is_active": True,
        "created_at": datetime.utcnow()
    }

    result = await users_collection.insert_one(user_dict)
    created_user = await users_collection.find_one({"_id": result.inserted_id})

    return UserResponse(
        id=str(created_user["_id"]),
        username=created_user["username"],
        is_active=created_user["is_active"],
        created_at=created_user["created_at"]
    )

async def login_user_service(user_credentials: UserLogin):
    user = await authenticate_user(user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )

    return access_token, user

