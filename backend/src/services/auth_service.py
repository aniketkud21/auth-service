from abc import ABC, abstractmethod

from ..schemas.api.auth import UserLoginRequest

class AuthService(ABC):
    @abstractmethod
    async def login(self, user: UserLoginRequest, db):
        pass

    @abstractmethod
    async def logout(self, session_token: str, db):
        pass

    @abstractmethod
    async def validate_session(self, session_token: str, db):
        pass

