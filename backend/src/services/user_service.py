from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..schemas import UserCreate, UserLogin, UserResponse
from ..db.models import User
from ..utils.passwords import hash_password, verify_password
from .session_service import SessionService

session_service = SessionService()

class UserService:
    async def create_user(self, user: UserCreate, db: AsyncSession) -> UserResponse:
        new_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hash_password(user.password),
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user
        
    async def get_user(self, user_id: int, username: str, email: str, db: AsyncSession):
        if user_id:
            query = select(User).where(User.id == user_id)
        elif username:
            query = select(User).where(User.username == username)
        elif email:
            query = select(User).where(User.email == email)
        else:
            raise ValueError("Please provide at least one of user_id, username, or email")
        result = await db.execute(query)
        return result.scalar_one()

    async def get_users(self, db: AsyncSession):
        query = select(User)
        result = await db.execute(query)
        return result.scalars().all()

    async def login(self, user: UserLogin, db: AsyncSession):
        db_user = await self.get_user(username=user.username, user_id=None, email=None, db=db)

        if not verify_password(user.password, db_user.hashed_password):
            raise ValueError("Invalid credentials")
        session_id = await session_service.create_session(db_user.id, db=db)
        return session_id
