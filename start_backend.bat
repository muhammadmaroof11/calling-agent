@echo off
echo =========================================================================
echo Starting Voxora Backend on PORT 8002 (FastAPI + Groq + Gemini + Neural TTS)
echo =========================================================================
cd /d "%~dp0"
backend\venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8002 --reload
pause
