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
    VERSION: str = "0.1.0"
    DEBUG: bool = True
    
    # Storage
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    AUDIO_CACHE_DIR: Path = BASE_DIR / "audio_cache"
    
    # OpenAI Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "whisper-1")
    
    # TTS Settings: "edge-tts" (free, no API key required) or "openai"
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
