from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..schemas.api.auth import UserCreateRequest
from ..schemas.api.users import UserResponse, UserUpdateRequest

from ..db.models import User

from ..utils.passwords import hash_password

from .session_service import SessionService

session_service = SessionService()

class UserService:
    async def create_user(self, user: UserCreateRequest, db: AsyncSession) -> UserResponse:
        new_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hash_password(user.password),
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user
        
    async def get_user(
        self,
        user_id: int | None = None,
        username: str | None = None,
        email: str | None = None,
        db: AsyncSession = None,
    ):
        if user_id:
            query = select(User).where(User.id == user_id)
        elif username:
            query = select(User).where(User.username == username)
        elif email:
            query = select(User).where(User.email == email)
        else:
            raise ValueError("Please provide at least one of user_id, username, or email")
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_users(self, db: AsyncSession):
        query = select(User)
        result = await db.execute(query)
        return result.scalars().all()

    async def update_user(self, user_id: int, user: UserUpdateRequest, db: AsyncSession):
        db_user = await self.get_user(user_id=user_id, db=db)

        if not db_user:
            return None

        # Extract update data, excluding fields that shouldn't be updated
        # exclude_unset=True ensures you don't overwrite existing data with None
        update_data = user.model_dump(exclude_unset=True)

        # Apply the changes to the Python object
        for key, value in update_data.items():
            setattr(db_user, key, value)

        await db.commit()
        await db.refresh(db_user)
        return db_user
    
        
        

