from .user_service import UserService
from .session_service import SessionService

from ..schemas.api.auth import UserLoginRequest

from ..utils.passwords import verify_password

class AuthService:
    def __init__(self):
        self.user_service = UserService()
        self.session_service = SessionService()
    
    async def login(self, user: UserLoginRequest, db):
        db_user = await self.user_service.get_user(None, user.username, None, db)

        if not db_user:
            raise ValueError("User not found")

        if not verify_password(user.password, db_user.hashed_password):
            raise ValueError("Invalid credentials")

        session_id = await self.session_service.create_session(db_user.id, db)
        return session_id
    
    async def logout(self, session_id: str, db):
        await self.session_service.delete_session(session_id, db)
        