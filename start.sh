#!/bin/bash
echo "Starting Piano Battle..."
echo

# Start backend
echo "Starting backend (FastAPI) on port 8000..."
cd "$(dirname "$0")/backend"
source venv/bin/activate 2>/dev/null || source .venv/bin/activate 2>/dev/null
python -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend (Vite) on port 5173..."
cd "$(dirname "$0")/frontend"
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers starting! Open http://localhost:5173 in Chrome or Edge."
echo "(Web MIDI API requires a Chromium-based browser)"
echo "Press Ctrl+C to stop both servers."
echo

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
