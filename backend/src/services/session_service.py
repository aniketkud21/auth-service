import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..db.models import Session

from .auth_service import AuthService
from .user_service import UserService

from ..utils.passwords import verify_password

from ..schemas.api.auth import UserLoginRequest

import os
from dotenv import load_dotenv

load_dotenv()

SESSION_TTL_IN_MINUTES = int(os.getenv("SESSION_TTL_IN_MINUTES", 30))

class SessionService(AuthService):
    def __init__(self):
        self.user_service = UserService()

    async def login(self, user: UserLoginRequest, db):
        db_user = await self.user_service.get_user(None, user.username, None, db)

        if not db_user:
            raise ValueError("User not found")

        if not verify_password(user.password, db_user.hashed_password):
            raise ValueError("Invalid credentials")

        session_token = await self.create_session(db_user.id, None, None, db)
        return session_token
    
    async def logout(self, session_token: str, db):
        await self.delete_session(session_token, db)

    async def validate_session(self, session_token: str, db: AsyncSession):
        session = await self.fetch_session(session_token, db)

        if not session:
            return {"is_valid": False, "user_id": None}

        if session.expires_at <= datetime.now(timezone.utc):
            await self.delete_session(session_token, db)
            return {"is_valid": False, "user_id": None}

        return {"is_valid": True, "user_id": session.user_id}

    # DB Interactions
    async def create_session(self, user_id: int, session_token: str | None, expires_at: datetime | None, db: AsyncSession) -> str:
        if not session_token:
            session_token = str(uuid.uuid4())

        if not expires_at:
            expires_at = datetime.now(timezone.utc) + timedelta(minutes=SESSION_TTL_IN_MINUTES)

        session = Session(
            user_id=user_id,
            session_token=session_token,
            expires_at=expires_at,
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session_token

    # async def fetch_session(self, session_token: str, db: AsyncSession):
    #     session = await db.get(Session, session_token)
    #     if not session:
    #         return None

    #     return session

    async def fetch_session(self, session_token: str | None = None, db: AsyncSession = None):
        if session_token:
            query = select(Session).where(Session.session_token == session_token)
        else:
            raise ValueError("Please provide a session token")
            
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def delete_session(self, session_token: str, db: AsyncSession):
        session = await self.fetch_session(session_token, db)
        if not session:
            return
        await db.delete(session)
        await db.commit()