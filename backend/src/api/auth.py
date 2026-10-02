from fastapi import APIRouter, Depends, Response

from sqlalchemy.ext.asyncio import AsyncSession

from ..db.database import get_db

from ..schemas.api.auth import UserCreateRequest, UserLoginRequest
from ..schemas.api.users import UserResponse

from ..services.auth_service import AuthService
from ..services.user_service import UserService

from ..utils.auth import get_user

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)

auth_service = AuthService()
user_service = UserService()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreateRequest, db: AsyncSession = Depends(get_db)):
    return await user_service.create_user(user, db)

@router.post("/login")
async def login(response: Response, user: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    session_id = await auth_service.login(user, db)

    response.set_cookie(
        key="session_id", 
        value=session_id,
        samesite="none",
        secure=True,
        httponly=True
    )

    return {"status": "success"}

@router.post("/logout")
async def logout(response: Response, user = Depends(get_user), db: AsyncSession = Depends(get_db)):
    session_id = (user.session_id if user and user.session_id else None)
    if session_id:
        await auth_service.logout(session_id, db)

    response.delete_cookie(
        key="session_id", 
        samesite="none",
        secure=True,
        httponly=True
    )

    return {"status": "success"}

