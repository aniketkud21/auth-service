from .api.auth import UserCreateRequest, UserLoginRequest
from .api.users import UserResponse

# Backwards-compatible aliases
UserCreate = UserCreateRequest
UserLogin = UserLoginRequest

__all__ = [
    "UserCreateRequest",
    "UserLoginRequest",
    "UserCreate",
    "UserLogin",
    "UserResponse",
]
