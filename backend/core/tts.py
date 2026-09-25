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
    1. 'edge-tts' (Microsoft Edge Neural Voices - Free, natural, no API key needed)
    2. 'fish-audio' (Fish Audio API - Ultra-realistic voice cloning / neural voices)
    3. 'openai' (OpenAI TTS-1 API)
    """
    def __init__(self):
        self.output_dir = settings.AUDIO_CACHE_DIR
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    def get_active_provider(self) -> str:
        provider = settings.TTS_PROVIDER.lower()
        if provider == "fish-audio" and settings.FISH_AUDIO_API_KEY:
            return "Fish Audio Neural TTS"
        if provider == "openai" and self.openai_client:
            return "OpenAI TTS-1"
        return f"Edge Neural TTS ({settings.EDGE_TTS_VOICE})"

    async def synthesize(self, text: str, voice_override: str = None) -> Tuple[str, float]:
        """
        Synthesizes text into an MP3 file.
        Returns: (filename, duration_seconds)
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
                # Optional voice / reference ID
                ref_id = voice_override or settings.FISH_AUDIO_REFERENCE_ID
                if ref_id:
                    payload["reference_id"] = ref_id

                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post("https://api.fish.audio/v1/tts", headers=headers, json=payload)
                    if resp.status_code == 200:
                        output_file.write_bytes(resp.content)
                        duration = time.time() - start_time
                        return file_id, duration
                    else:
                        print(f"[TTS] Fish Audio returned status {resp.status_code}: {resp.text}. Falling back to Edge-TTS.")
            except Exception as e:
                print(f"[TTS] Fish Audio error: {e}. Falling back to Edge-TTS.")

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
                return file_id, duration
            except Exception as e:
                print(f"[TTS] OpenAI TTS error: {e}. Falling back to Edge-TTS.")

        # 3. Default to Edge-TTS: high-fidelity neural voice, 100% free with zero keys!
        voice = voice_override or settings.EDGE_TTS_VOICE
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(str(output_file))

        duration = time.time() - start_time
        return file_id, duration

tts_service = TextToSpeechService()
