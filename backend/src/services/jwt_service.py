from datetime import datetime, timedelta, timezone
import jwt

from .auth_service import AuthService
from .user_service import UserService
from .session_service import SessionService

from ..schemas.api.auth import UserLoginRequest

from ..utils.passwords import verify_password

import os
from dotenv import load_dotenv

load_dotenv()

SESSION_TTL_IN_MINUTES = int(os.getenv("SESSION_TTL_IN_MINUTES"))
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")

class JWTService(AuthService):
    def __init__(self):
        self.user_service = UserService()
        self.session_service = SessionService()

    async def login(self, user: UserLoginRequest, db):
        db_user = await self.user_service.get_user(None, user.username, None, db)

        if not db_user:
            raise ValueError("User not found")

        if not verify_password(user.password, db_user.hashed_password):
            raise ValueError("Invalid credentials")

        token, expires_at = self.issue_token(db_user.id)

        await self.session_service.create_session(db_user.id, token, expires_at, db)
        return token
    
    async def logout(self, session_token: str, db):
        pass

    async def validate_session(self, session_token: str, db):
        return self.verify_token(session_token)
        
    def issue_token(self, user_id: int):
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=SESSION_TTL_IN_MINUTES)

        payload = {
            "sub" : str(user_id),
            "exp" : expires_at,
            "iat" : datetime.now(timezone.utc)
        }

        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

        return token, expires_at

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            return {"is_valid": True, "user_id": int(payload["sub"])}

        except jwt.ExpiredSignatureError:
            return {"is_valid": False, "user_id": None}

        except jwt.InvalidTokenError:
            return {"is_valid": False, "user_id": None}
    