#!/usr/bin/env bash

# Resolve project root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Load backend environment variables if backend/.env exists (fallback to root .env)
if [ -f "$ROOT_DIR/backend/.env" ]; then
  export $(grep -v '^#' "$ROOT_DIR/backend/.env" | xargs)
elif [ -f "$ROOT_DIR/.env" ]; then
  export $(grep -v '^#' "$ROOT_DIR/.env" | xargs)
fi

BACKEND_PORT="${PORT:-8000}"

# Load frontend environment variables if frontend/.env exists
if [ -f "$ROOT_DIR/frontend/.env" ]; then
  FRONTEND_PORT=$(grep '^PORT=' "$ROOT_DIR/frontend/.env" | cut -d '=' -f2)
fi
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

echo "=========================================="
echo " Starting Auth Service (FE + BE)"
echo " Backend Port  : http://localhost:$BACKEND_PORT"
echo " Frontend Port : http://localhost:$FRONTEND_PORT"
echo "=========================================="

# Cleanup child processes on exit (Ctrl+C)
cleanup() {
  echo ""
  echo "Shutting down servers..."
  kill $(jobs -p) 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Run database migrations
echo "-> Running database migrations..."
(cd "$ROOT_DIR/backend" && uv run alembic upgrade head)

# Start Backend using uv from backend directory
echo "-> Starting Backend (FastAPI)..."
(cd "$ROOT_DIR/backend" && uv run --project "$ROOT_DIR" uvicorn src.main:app --host 0.0.0.0 --port "$BACKEND_PORT" --reload) &
BACKEND_PID=$!

# Start Frontend using npm
echo "-> Starting Frontend (Vite)..."
(cd "$ROOT_DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

# Wait for both processes
wait
