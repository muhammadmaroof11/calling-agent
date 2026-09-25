import io
import time
from typing import Tuple
from openai import OpenAI
from backend.core.config import settings

class SpeechToTextService:
    """
    Handles Speech-to-Text conversion.
    Uses OpenAI Whisper API (`whisper-1`) when an API key is configured.
    Falls back gracefully if no key is provided, allowing testing without blockers.
    """
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def is_configured(self) -> bool:
        return bool(self.api_key and self.client)

    async def transcribe(self, audio_bytes: bytes, filename: str = "audio.webm") -> Tuple[str, float]:
        """
        Transcribes the given audio bytes into text.
        Returns: (transcribed_text, duration_seconds)
        """
        start_time = time.time()
        
        # If OpenAI key is present, use Whisper API
        if self.is_configured():
            try:
                # Prepare in-memory file for OpenAI SDK
                audio_file = io.BytesIO(audio_bytes)
                audio_file.name = filename
                
                response = self.client.audio.transcriptions.create(
                    model=settings.WHISPER_MODEL,
                    file=audio_file,
                    language="en"
                )
                duration = time.time() - start_time
                transcript = response.text.strip()
                return transcript, duration
            except Exception as e:
                duration = time.time() - start_time
                raise RuntimeError(f"OpenAI Whisper transcription failed: {str(e)}")
        
        # Fallback when no OpenAI API key is supplied
        duration = time.time() - start_time
        return (
            "Hello Voxora, this is a simulated voice test since no OpenAI API key was provided.",
            duration
        )

stt_service = SpeechToTextService()
