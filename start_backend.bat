@echo off
echo ========================================================
echo Starting Voxora Backend (FastAPI + Whisper + Neural TTS)
echo ========================================================
cd /d "%~dp0"
backend\venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
