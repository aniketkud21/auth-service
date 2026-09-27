from fastapi import Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.database import get_db
from ..services.session_service import SessionService
from ..services.user_service import UserService

session_service = SessionService()
user_service = UserService()

async def get_user(request: Request, db: AsyncSession = Depends(get_db)):
    session_id = request.cookies.get("session_id")

    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await session_service.validate_session(session_id, db)
    if not result["is_active"]:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user = await user_service.get_user(result["user_id"], None, None, db)

    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return user