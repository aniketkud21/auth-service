# Kinto

A lightweight, asynchronous full-stack authentication and session management engine built with **FastAPI**, **PostgreSQL**, and **React + Vite**.

---

## Tech Stack

- **Backend**: Python 3.14, [FastAPI](https://fastapi.tiangolo.com/), [SQLAlchemy 2.0 (AsyncIO)](https://www.sqlalchemy.org/), [Alembic](https://alembic.sqlalchemy.org/), [uvicorn](https://www.uvicorn.org/)
- **Password Hashing**: [pwdlib](https://github.com/frankie567/pwdlib) with Argon2id (`argon2-cffi`)
- **Database**: PostgreSQL (via `asyncpg`)
- **Frontend**: React 19, TypeScript, [Vite](https://vitejs.dev/), Tailwind CSS, Radix UI
- **Package Managers**: `uv` (Python), `npm` (Frontend)

---

## Features

- **User Registration & Login**: Account creation with automatic Argon2 password hashing.
- **Session Management**: Server-side session tokens stored in PostgreSQL with expiration tracking.
- **Cookie-Based Authentication**: Secure, HttpOnly session cookies for authenticated requests.
- **User Directory**: Protected `/api/users` endpoint and interactive UI to browse registered users.
- **Automated Database Migrations**: Alembic migrations run automatically on server launch.

---

## Project Structure

```
auth-service/
├── backend/
│   ├── alembic/              # Database migration versions
│   ├── src/
│   │   ├── db/               # Database engine and SQLAlchemy models
│   │   ├── services/         # UserService and SessionService logic
│   │   ├── utils/            # Password hashing and auth dependencies
│   │   ├── main.py           # FastAPI application & route endpoints
│   │   └── schemas.py        # Pydantic request/response models
│   ├── alembic.ini
│   └── .env                  # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/       # React UI components (UsersPage, AuthCard, Navbar)
│   │   ├── services/         # API client layer (authApi)
│   │   ├── App.tsx           # Main application view
│   │   └── main.tsx
│   └── .env                  # Frontend port configuration
├── pyproject.toml            # Python dependencies (managed by uv)
├── start.sh                  # Single-command launch script (FE + BE)
└── README.md
```

---

## Getting Started

### Prerequisites

- [Python >= 3.14](https://www.python.org/)
- [uv](https://docs.astral.sh/uv/) (fast Python package manager)
- [Node.js & npm](https://nodejs.org/)
- Running **PostgreSQL** instance

### 1. Environment Configuration

Create or update the backend environment file in `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://<username>:<password>@localhost:5432/auth-service
PORT=8000
```

Frontend environment file in `frontend/.env`:

```env
PORT=5000
VITE_BACKEND_PORT=8000
```

### 2. Install Dependencies

**Backend:**
```bash
uv sync
```

**Frontend:**
```bash
cd frontend && npm install && cd ..
```

---

## Running the Application

Use the provided startup script to automatically run database migrations and boot both the backend and frontend servers:

```bash
chmod +x start.sh
./start.sh
```

- **Frontend**: [http://localhost:5000](http://localhost:5000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/health` | Health check endpoint | No |
| `POST` | `/api/register` | Register a new user account | No |
| `POST` | `/api/login` | Log in and receive a session cookie | No |
| `GET` | `/api/users` | List all registered users | **Yes** (Session Cookie) |

---

## Database Migrations

Run Alembic commands from the `backend/` directory:

```bash
cd backend

# Create a new migration after updating models:
uv run alembic revision --autogenerate -m "describe changes"

# Apply pending migrations:
uv run alembic upgrade head
```
