import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env if present
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings(BaseModel):
    # App
    APP_NAME: str = "Voxora Calling Agent"
    VERSION: str = "0.2.0"
    DEBUG: bool = True
    
    # Storage
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    AUDIO_CACHE_DIR: Path = BASE_DIR / "audio_cache"
    
    # API Keys
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    FISH_AUDIO_API_KEY: str = os.getenv("FISH_AUDIO_API_KEY", "")
    FISH_AUDIO_REFERENCE_ID: str = os.getenv("FISH_AUDIO_REFERENCE_ID", "")
    
    # Provider selections
    # STT: "groq" (fast & free Whisper), "openai", or "fallback"
    STT_PROVIDER: str = os.getenv("STT_PROVIDER", "groq" if os.getenv("GROQ_API_KEY") else "openai" if os.getenv("OPENAI_API_KEY") else "fallback")
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "whisper-large-v3-turbo")
    
    # LLM: "gemini" (free tier), "groq" (free tier), "openai", or "mock"
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini" if os.getenv("GEMINI_API_KEY") else "groq" if os.getenv("GROQ_API_KEY") else "openai" if os.getenv("OPENAI_API_KEY") else "mock")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    # TTS: "edge-tts" (free neural), "fish-audio" (free trial credits), "openai"
    TTS_PROVIDER: str = os.getenv("TTS_PROVIDER", "edge-tts")
    EDGE_TTS_VOICE: str = os.getenv("EDGE_TTS_VOICE", "en-US-AriaNeural")
    OPENAI_TTS_VOICE: str = os.getenv("OPENAI_TTS_VOICE", "alloy")
    
    # System Persona for Calling Agent
    SYSTEM_PROMPT: str = os.getenv(
        "SYSTEM_PROMPT",
        "You are Voxora, an intelligent and friendly voice calling agent. "
        "You are speaking on a live telephone call. "
        "Keep your answers concise, natural, conversational, and direct (typically 1 to 3 sentences). "
        "Never use markdown formatting like asterisks, bullet points, numbered lists, or emojis, "
        "because your text will be read aloud by a Text-to-Speech voice engine."
    )

settings = Settings()
settings.AUDIO_CACHE_DIR.mkdir(parents=True, exist_ok=True)
