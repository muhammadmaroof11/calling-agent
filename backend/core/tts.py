import uuid
import time
from pathlib import Path
from typing import Tuple
import edge_tts
from openai import OpenAI
from backend.core.config import settings

class TextToSpeechService:
    """
    Synthesizes text into spoken audio files.
    Supports:
    1. 'edge-tts' (Microsoft Edge Neural Voices - Free, natural, no API key needed)
    2. 'openai' (OpenAI TTS-1 API)
    """
    def __init__(self):
        self.output_dir = settings.AUDIO_CACHE_DIR
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    async def synthesize(self, text: str, voice_override: str = None) -> Tuple[str, float]:
        """
        Synthesizes text into an MP3 file.
        Returns: (filename, duration_seconds)
        """
        start_time = time.time()
        file_id = f"vox_{uuid.uuid4().hex[:8]}.mp3"
        output_file = self.output_dir / file_id
        
        provider = settings.TTS_PROVIDER.lower()

        # If user explicitly configured OpenAI TTS and has key
        if provider == "openai" and self.openai_client:
            voice = voice_override or settings.OPENAI_TTS_VOICE
            response = self.openai_client.audio.speech.create(
                model="tts-1",
                voice=voice,
                input=text
            )
            response.stream_to_file(str(output_file))
        else:
            # Default to Edge-TTS: high-fidelity neural voice without any API key!
            voice = voice_override or settings.EDGE_TTS_VOICE
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(str(output_file))

        duration = time.time() - start_time
        return file_id, duration

tts_service = TextToSpeechService()
