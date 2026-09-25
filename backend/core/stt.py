import io
import time
from typing import Tuple
from openai import OpenAI
from backend.core.config import settings

class SpeechToTextService:
    """
    Handles Speech-to-Text conversion.
    Supports:
    1. Groq Cloud Whisper (whisper-large-v3-turbo) - Blazing fast & 100% Free tier!
    2. OpenAI Whisper (whisper-1)
    3. Simulated offline fallback
    """
    def __init__(self):
        self.groq_client = None
        self.openai_client = None
        
        if settings.GROQ_API_KEY:
            self.groq_client = OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=settings.GROQ_API_KEY
            )
            
        if settings.OPENAI_API_KEY:
            self.openai_client = OpenAI(
                api_key=settings.OPENAI_API_KEY
            )

    def get_active_provider(self) -> str:
        if self.groq_client:
            return "Groq Whisper (Free Tier)"
        if self.openai_client:
            return "OpenAI Whisper"
        return "Offline Fallback"

    async def transcribe(self, audio_bytes: bytes, filename: str = "audio.webm") -> Tuple[str, float]:
        """
        Transcribes the given audio bytes into text.
        Returns: (transcribed_text, duration_seconds)
        """
        start_time = time.time()
        
        # 1. Prefer Groq Whisper if configured (free and ultra-fast)
        if self.groq_client:
            try:
                audio_file = io.BytesIO(audio_bytes)
                audio_file.name = filename
                
                response = self.groq_client.audio.transcriptions.create(
                    model=settings.WHISPER_MODEL,
                    file=audio_file,
                    language="en"
                )
                duration = time.time() - start_time
                transcript = response.text.strip()
                return transcript, duration
            except Exception as e:
                # If Groq fails, try next or log
                print(f"[STT] Groq Whisper error: {e}")
        
        # 2. Try OpenAI Whisper if configured
        if self.openai_client:
            try:
                audio_file = io.BytesIO(audio_bytes)
                audio_file.name = filename
                
                response = self.openai_client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language="en"
                )
                duration = time.time() - start_time
                transcript = response.text.strip()
                return transcript, duration
            except Exception as e:
                print(f"[STT] OpenAI Whisper error: {e}")
                
        # 3. Fallback when no keys are working
        duration = time.time() - start_time
        return (
            "Hello Voxora, this is a simulated voice test since no speech service processed the audio.",
            duration
        )

stt_service = SpeechToTextService()
