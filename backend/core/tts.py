import uuid
import time
import httpx
from pathlib import Path
from typing import Tuple
import edge_tts
from openai import OpenAI
from backend.core.config import settings

class TextToSpeechService:
    """
    Synthesizes text into spoken audio files.
    Supports:
    1. 'fish-audio' (Fish Audio API - Ultra-realistic voice cloning / neural voices)
    2. 'edge-tts' (User's Neural Voices - Free, natural, zero credits needed, bulletproof fallback)
    3. 'openai' (OpenAI TTS-1 API)
    """
    def __init__(self):
        self.output_dir = settings.AUDIO_CACHE_DIR
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    def get_active_provider(self) -> str:
        provider = settings.TTS_PROVIDER.lower()
        if provider == "fish-audio" and settings.FISH_AUDIO_API_KEY:
            return "Fish Audio (Fallback: User's Neural TTS)"
        if provider == "openai" and self.openai_client:
            return "OpenAI TTS-1"
        return f"User Neural TTS ({settings.EDGE_TTS_VOICE})"

    async def synthesize(self, text: str, voice_override: str = None) -> Tuple[str, float, str]:
        """
        Synthesizes text into an MP3 file.
        Returns: (filename, duration_seconds, engine_used)
        """
        start_time = time.time()
        file_id = f"vox_{uuid.uuid4().hex[:8]}.mp3"
        output_file = self.output_dir / file_id
        
        provider = settings.TTS_PROVIDER.lower()

        # 1. Fish Audio TTS (if selected and API key provided)
        if provider == "fish-audio" and settings.FISH_AUDIO_API_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {settings.FISH_AUDIO_API_KEY}",
                    "Content-Type": "application/json",
                }
                payload = {
                    "text": text,
                    "format": "mp3",
                }
                ref_id = voice_override or settings.FISH_AUDIO_REFERENCE_ID
                if ref_id and not ref_id.startswith("en-"):
                    payload["reference_id"] = ref_id

                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post("https://api.fish.audio/v1/tts", headers=headers, json=payload)
                    if resp.status_code == 200:
                        output_file.write_bytes(resp.content)
                        duration = time.time() - start_time
                        return file_id, duration, "Fish Audio"
                    else:
                        print(f"[TTS] Fish Audio status {resp.status_code} ({resp.text[:80]}). Seamlessly falling back to User's Neural TTS.")
            except Exception as e:
                print(f"[TTS] Fish Audio connection error: {e}. Falling back to User's Neural TTS.")

        # 2. OpenAI TTS (if selected and configured)
        if provider == "openai" and self.openai_client:
            try:
                voice = voice_override or settings.OPENAI_TTS_VOICE
                response = self.openai_client.audio.speech.create(
                    model="tts-1",
                    voice=voice,
                    input=text
                )
                response.stream_to_file(str(output_file))
                duration = time.time() - start_time
                return file_id, duration, "OpenAI TTS-1"
            except Exception as e:
                print(f"[TTS] OpenAI TTS error: {e}. Falling back to User's Neural TTS.")

        # 3. User's Neural TTS Fallback (Edge-TTS: high-fidelity, free, unlimited, zero credits)
        voice = voice_override if voice_override and voice_override.startswith("en-") else settings.EDGE_TTS_VOICE
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(str(output_file))

        duration = time.time() - start_time
        return file_id, duration, f"User Neural TTS ({voice})"

tts_service = TextToSpeechService()
