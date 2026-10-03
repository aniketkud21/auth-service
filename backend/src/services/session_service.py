import uuid
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
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

        session_token = await self.create_session(db_user.id, db)
        return session_token
    
    async def logout(self, session_token: str, db):
        await self.delete_session(session_token, db)

    async def validate_session(self, session_token: str, db: AsyncSession):
        session = await self.fetch_session(session_token, db)

        if not session:
            return {"is_valid": False, "user_id": None}

        if session.expires_at <= datetime.now():
            await self.delete_session(session_token, db)
            return {"is_valid": False, "user_id": None}

        return {"is_valid": True, "user_id": session.user_id}

    # DB Interactions
    async def create_session(self, user_id: int, db: AsyncSession) -> str:
        session_token = str(uuid.uuid4())
        session = Session(
            id=session_token, 
            user_id=user_id,
            expires_at=datetime.now() + timedelta(minutes=SESSION_TTL_IN_MINUTES),
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session_token

    async def fetch_session(self, session_token: str, db: AsyncSession):
        session = await db.get(Session, session_token)
        if not session:
            return None

        return session

    async def delete_session(self, session_token: str, db: AsyncSession):
        session = await self.fetch_session(session_token, db)
        if not session:
            return
        await db.delete(session)
        await db.commit()