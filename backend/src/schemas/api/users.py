from pydantic import BaseModel
from datetime import datetime

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime

class UserUpdateRequest(BaseModel):
    username: str | None = None
    email: str | None = None
    is_active: bool | None = None
    is_admin: bool | None = None