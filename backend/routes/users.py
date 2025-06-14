from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from backend.auth import get_current_active_user
from mongo.model.modelUser import UserResponse, APIResponse
from mongo.database import users_collection
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_active_user)):
    """Get current user information"""
    return UserResponse(
        id=str(current_user["_id"]),
        username=current_user["username"],
        is_active=current_user["is_active"],
        created_at=current_user["created_at"]
    )

@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0, 
    limit: int = 100,
):
    """Get all users (protected route)"""
    users = []
    cursor = users_collection.find({}).skip(skip).limit(limit)
    
    async for user in cursor:
        users.append(UserResponse(
            id=str(user["_id"]),
            username=user["username"],
            is_active=user["is_active"],
            created_at=user["created_at"]
        ))
    
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
):
    """Get user by ID"""
    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse(
            id=str(user["_id"]),
            username=user["username"],
            is_active=user["is_active"],
            created_at=user["created_at"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

@router.delete("/me", response_model=APIResponse)
async def delete_current_user(current_user: dict = Depends(get_current_active_user)):
    """Delete current user account"""
    await users_collection.delete_one({"_id": current_user["_id"]})
    
    return APIResponse(
        message="User account deleted successfully",
        status="success"
    )