from fastapi import APIRouter, Depends, Response

from sqlalchemy.ext.asyncio import AsyncSession

from ..db.database import get_db

from ..schemas.api.auth import UserCreateRequest, UserLoginRequest
from ..schemas.api.users import UserResponse

from ..services.session_service import SessionService
from ..services.jwt_service import JWTService

from ..services.user_service import UserService

from ..utils.auth import get_user

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)

auth_service = SessionService()
# auth_service = JWTService()
user_service = UserService()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreateRequest, db: AsyncSession = Depends(get_db)):
    return await user_service.create_user(user, db)

@router.post("/login")
async def login(response: Response, user: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    session_token = await auth_service.login(user, db)

    response.set_cookie(
        key="session_token", 
        value=session_token,
        samesite="none",
        secure=True,
        httponly=True
    )

    return {"status": "success"}

@router.post("/logout")
async def logout(response: Response, user = Depends(get_user), db: AsyncSession = Depends(get_db)):
    session_token = (user.session_token if user and hasattr(user, "session_token") else None)
    if session_token:
        await auth_service.logout(session_token, db)

    response.delete_cookie(
        key="session_token", 
        samesite="none",
        secure=True,
        httponly=True
    )

    return {"status": "success"}

