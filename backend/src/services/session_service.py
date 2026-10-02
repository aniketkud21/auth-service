import uuid
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.models import Session

class SessionService:
    async def create_session(self, user_id: int, db: AsyncSession) -> str:
        session_id = str(uuid.uuid4())
        session = Session(
            id=session_id, 
            user_id=user_id,
            expires_at=datetime.now() + timedelta(minutes=30),
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session_id

    async def fetch_session(self, session_id: str, db: AsyncSession):
        session = await db.get(Session, session_id)
        if not session:
            return None

        return session
    
    async def validate_session(self, session_id: str, db: AsyncSession):
        session = await self.fetch_session(session_id, db)

        if not session:
            return {"is_active": False, "user_id": None}

        if session.expires_at <= datetime.now():
            await self.delete_session(session_id, db)
            return {"is_active": False, "user_id": None}

        return {"is_active": True, "user_id": session.user_id}

    async def delete_session(self, session_id: str, db: AsyncSession):
        session = await self.fetch_session(session_id, db)
        if not session:
            return
        await db.delete(session)
        await db.commit()