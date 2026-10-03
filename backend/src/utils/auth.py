from fastapi import Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.database import get_db

from ..services.session_service import SessionService
from ..services.jwt_service import JWTService

from ..services.user_service import UserService


# auth_service = SessionService()
auth_service = JWTService()
user_service = UserService()

async def get_user(request: Request, db: AsyncSession = Depends(get_db)):
    session_token = request.cookies.get("session_token")

    if not session_token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await auth_service.validate_session(session_token, db)
    if not result["is_valid"]:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user = await user_service.get_user(result["user_id"], None, None, db)

    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Attach session_token
    user.session_token = session_token

    return user