import os
import uuid
import time
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.core.config import settings
from backend.core.stt import stt_service
from backend.core.brain import agent_brain
from backend.core.tts import tts_service

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Minimalist Voice Calling Agent with STT (Groq Whisper), LLM Brain (Gemini/Groq), and TTS (Edge/Fish Audio)"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextTurnRequest(BaseModel):
    text: str
    session_id: Optional[str] = None
    voice: Optional[str] = None

class ResetSessionRequest(BaseModel):
    session_id: str

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.VERSION
    }

@app.get("/api/call/status")
def get_status():
    """
    Returns the current capabilities and configuration of the voice agent.
    """
    return {
        "stt_provider": stt_service.get_active_provider(),
        "llm_provider": agent_brain.get_active_provider(),
        "tts_provider": tts_service.get_active_provider(),
        "groq_configured": bool(settings.GROQ_API_KEY),
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "fish_audio_configured": bool(settings.FISH_AUDIO_API_KEY),
        "openai_configured": bool(settings.OPENAI_API_KEY),
        "edge_voice": settings.EDGE_TTS_VOICE,
        "is_free_stack": True,
        "audio_cache_count": len(list(settings.AUDIO_CACHE_DIR.glob("*.mp3")))
    }

@app.post("/api/call/voice-turn")
async def voice_turn(
    audio: UploadFile = File(...),
    session_id: Optional[str] = Form(None),
    voice: Optional[str] = Form(None)
):
    """
    Core Voice Calling Loop:
    1. STT: User Audio -> Transcribed Text (Groq Whisper / OpenAI Whisper)
    2. Brain: Transcribed Text -> Agent Reply (Gemini / Groq / OpenAI LLM)
    3. TTS: Agent Reply -> Spoken Audio (Edge-TTS / Fish Audio / OpenAI)
    """
    overall_start = time.time()
    
    if not session_id:
        session_id = str(uuid.uuid4())
        
    try:
        audio_bytes = await audio.read()
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty audio recording received.")

        # 1. Speech-to-Text (STT)
        user_text, stt_duration = await stt_service.transcribe(
            audio_bytes=audio_bytes,
            filename=audio.filename or "recording.webm"
        )
        
        # 2. Agent Brain (LLM Conversation Turn)
        agent_reply, llm_duration = await agent_brain.generate_reply(
            session_id=session_id,
            user_text=user_text
        )
        
        # 3. Text-to-Speech (TTS)
        audio_filename, tts_duration, tts_engine = await tts_service.synthesize(
            text=agent_reply,
            voice_override=voice
        )
        
        total_duration = time.time() - overall_start
        
        return {
            "session_id": session_id,
            "user_text": user_text,
            "agent_reply": agent_reply,
            "audio_url": f"/api/audio/{audio_filename}",
            "tts_engine": tts_engine,
            "metrics": {
                "stt_ms": round(stt_duration * 1000),
                "llm_ms": round(llm_duration * 1000),
                "tts_ms": round(tts_duration * 1000),
                "total_ms": round(total_duration * 1000)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/call/text-turn")
async def text_turn(payload: TextTurnRequest):
    """
    Text-based calling turn. Useful for:
    - Testing without microphone
    - Browser Web Speech STT output
    """
    overall_start = time.time()
    session_id = payload.session_id or str(uuid.uuid4())
    
    try:
        # 1. Agent Brain
        agent_reply, llm_duration = await agent_brain.generate_reply(
            session_id=session_id,
            user_text=payload.text
        )
        
        # 2. Text-to-Speech
        audio_filename, tts_duration, tts_engine = await tts_service.synthesize(
            text=agent_reply,
            voice_override=payload.voice
        )
        
        total_duration = time.time() - overall_start
        
        return {
            "session_id": session_id,
            "user_text": payload.text,
            "agent_reply": agent_reply,
            "audio_url": f"/api/audio/{audio_filename}",
            "tts_engine": tts_engine,
            "metrics": {
                "stt_ms": 0,
                "llm_ms": round(llm_duration * 1000),
                "tts_ms": round(tts_duration * 1000),
                "total_ms": round(total_duration * 1000)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/call/reset")
def reset_call_session(payload: ResetSessionRequest):
    agent_brain.reset_session(payload.session_id)
    return {"status": "ok", "message": f"Session {payload.session_id} reset."}

@app.api_route("/api/audio/{filename}", methods=["GET", "HEAD"])
def get_audio_file(filename: str):
    file_path = settings.AUDIO_CACHE_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(file_path, media_type="audio/mpeg")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
