from fastapi import (
    FastAPI,
    Depends,
    Response,
    HTTPException,
)
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.ext.asyncio import AsyncSession

from .db.database import get_db

from .schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
)
from .services.user_service import UserService
from .services.session_service import SessionService
from .utils.auth import get_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user_service = UserService()
session_service = SessionService()

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await user_service.create_user(user, db)

@app.post("/api/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db), response: Response = Response()):
    session_id = await user_service.login(user, db)
    response.set_cookie(
        key="session_id", 
        value=session_id,
        samesite="none",
        secure=True,
        httponly=True
    )

    return {"status": "success"}

@app.get("/api/users", response_model=list[UserResponse])
async def get_users(user = Depends(get_user), db: AsyncSession = Depends(get_db)):
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Forbidden")
    return await user_service.get_users(db)