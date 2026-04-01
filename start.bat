@echo off
echo Starting Piano Battle...
echo.
echo Starting backend (FastAPI) on port 8000...
start "Piano Battle - Backend" cmd /c "cd /d %~dp0backend && python -m uvicorn main:app --reload --port 8000"

echo Starting frontend (Vite) on port 5173...
start "Piano Battle - Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers starting! Open http://localhost:5173 in Chrome or Edge.
echo (Web MIDI API requires a Chromium-based browser)
echo.
pause
