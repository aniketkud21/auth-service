from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

from ..db.database import get_db

from ..utils.auth import get_user

from ..schemas.api.users import UserResponse, UserUpdateRequest
from ..schemas.api.auth import UserCreateRequest

from ..services.user_service import UserService

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
)
user_service = UserService()

# TODO: Add search query, role filter, status filter, and cursor-based pagination parameters:
# async def get_users(query: Optional[str] = None, role: Optional[str] = None, is_active: Optional[bool] = None, limit: int = 50, offset: int = 0, ...)
@router.get("/", response_model=list[UserResponse])
async def get_users(current_user = Depends(get_user), db: AsyncSession = Depends(get_db)):
    return await user_service.get_users(db)

# TODO: Add endpoint for listing user active sessions:
# @router.get("/{id}/sessions", response_model=list[SessionResponse])
# async def get_user_sessions(id: int, current_user = Depends(get_user), db: AsyncSession = Depends(get_db)): ...

# TODO: Add endpoint for revoking user sessions or soft-deleting/deactivating user:
# @router.delete("/{id}")
# async def delete_user(id: int, current_user = Depends(get_user), db: AsyncSession = Depends(get_db)): ...


@router.get("/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_user)):
    return current_user

@router.get("/{id}", response_model=UserResponse)
async def get_user_by_id(id: int, current_user = Depends(get_user), db: AsyncSession = Depends(get_db)):
    user = await user_service.get_user(user_id=id, db=db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserResponse)
async def create(user: UserCreateRequest, current_user = Depends(get_user), db: AsyncSession = Depends(get_db)):
    return await user_service.create_user(user, db)

@router.put("/{id}", response_model=UserResponse)
async def update(id: int, user: UserUpdateRequest, current_user = Depends(get_user), db: AsyncSession = Depends(get_db)):
    updated_user = await user_service.update_user(id, user, db)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user