from fastapi import (FastAPI)
from fastapi.middleware.cors import CORSMiddleware

# Routes
from .api.auth import router as auth_router
from .api.users import router as users_router

app = FastAPI(
    title="Kinto",
    description="Lightweight, asynchronous authentication and session management service.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:9001",
        "http://127.0.0.1:9001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)

@app.get("/api/health")
def health():
    return {"status": "ok"}