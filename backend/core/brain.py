import time
from typing import Dict, List, Tuple
from openai import OpenAI
from backend.core.config import settings

class AgentBrain:
    """
    Manages conversational memory and response generation for calling agent sessions.
    Supports:
    1. Google Gemini (e.g. gemini-2.5-flash) - Free Tier via Gemini API Key
    2. Groq LLM (e.g. qwen/qwen3.8-27b / openai/gpt-oss-120b) - Free Tier via Groq API Key
    3. OpenAI GPT (e.g. gpt-4o-mini)
    4. Built-in smart mock voice persona
    """
    def __init__(self):
        self.gemini_client = None
        self.groq_client = None
        self.openai_client = None
        
        # Initialize Gemini client via OpenAI-compatible endpoint
        if settings.GEMINI_API_KEY:
            self.gemini_client = OpenAI(
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
                api_key=settings.GEMINI_API_KEY
            )
            
        # Initialize Groq client
        if settings.GROQ_API_KEY:
            self.groq_client = OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=settings.GROQ_API_KEY
            )
            
        # Initialize OpenAI client
        if settings.OPENAI_API_KEY:
            self.openai_client = OpenAI(
                api_key=settings.OPENAI_API_KEY
            )

        # In-memory store: { session_id: [ {"role": "system"|"user"|"assistant", "content": "..."} ] }
        self.sessions: Dict[str, List[Dict[str, str]]] = {}

    def get_active_provider(self) -> str:
        provider = settings.LLM_PROVIDER.lower()
        if provider == "gemini" and self.gemini_client:
            return f"Gemini ({settings.GEMINI_MODEL})"
        if provider == "groq" and self.groq_client:
            return f"Groq ({settings.GROQ_MODEL})"
        if self.gemini_client:
            return f"Gemini ({settings.GEMINI_MODEL})"
        if self.groq_client:
            return f"Groq ({settings.GROQ_MODEL})"
        if self.openai_client:
            return f"OpenAI ({settings.OPENAI_MODEL})"
        return "Built-in Rule Engine"

    def get_or_create_session(self, session_id: str) -> List[Dict[str, str]]:
        if session_id not in self.sessions:
            self.sessions[session_id] = [
                {"role": "system", "content": settings.SYSTEM_PROMPT}
            ]
        return self.sessions[session_id]

    def reset_session(self, session_id: str) -> None:
        self.sessions[session_id] = [
            {"role": "system", "content": settings.SYSTEM_PROMPT}
        ]

    async def generate_reply(self, session_id: str, user_text: str) -> Tuple[str, float]:
        """
        Takes the user's transcribed text, updates session history, and generates the agent's reply.
        Returns: (agent_reply_text, duration_seconds)
        """
        start_time = time.time()
        history = self.get_or_create_session(session_id)
        history.append({"role": "user", "content": user_text})
        
        provider = settings.LLM_PROVIDER.lower()

        # 1. Try Gemini if configured (or requested)
        if (provider == "gemini" or not self.openai_client) and self.gemini_client:
            try:
                response = self.gemini_client.chat.completions.create(
                    model=settings.GEMINI_MODEL,
                    messages=history,
                    temperature=0.7,
                    max_tokens=200
                )
                reply = response.choices[0].message.content.strip()
                history.append({"role": "assistant", "content": reply})
                duration = time.time() - start_time
                return reply, duration
            except Exception as e:
                print(f"[Brain] Gemini generation error: {e}")

        # 2. Try Groq if configured
        if self.groq_client:
            try:
                response = self.groq_client.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=history,
                    temperature=0.7,
                    max_tokens=200
                )
                reply = response.choices[0].message.content.strip()
                history.append({"role": "assistant", "content": reply})
                duration = time.time() - start_time
                return reply, duration
            except Exception as e:
                print(f"[Brain] Groq generation error: {e}")

        # 3. Try OpenAI if configured
        if self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    messages=history,
                    temperature=0.7,
                    max_tokens=200
                )
                reply = response.choices[0].message.content.strip()
                history.append({"role": "assistant", "content": reply})
                duration = time.time() - start_time
                return reply, duration
            except Exception as e:
                print(f"[Brain] OpenAI generation error: {e}")

        # 4. Smart local mock voice agent fallback
        reply = self._mock_voice_agent(user_text)
        history.append({"role": "assistant", "content": reply})
        duration = time.time() - start_time
        return reply, duration

    def _mock_voice_agent(self, user_text: str) -> str:
        text = user_text.lower().strip()
        if any(w in text for w in ["hello", "hi", "hey", "good morning", "good evening"]):
            return "Hello! Thank you for calling Voxora. How can I assist you today?"
        elif any(w in text for w in ["who are you", "what is this", "what are you"]):
            return "I am Voxora, your lightweight voice calling agent running on FastAPI and React. I can listen with Whisper, think, and speak back in real time."
        elif any(w in text for w in ["appointment", "schedule", "book"]):
            return "I can certainly help you schedule that appointment. Would you prefer a morning or afternoon slot this week?"
        elif any(w in text for w in ["hours", "open", "time"]):
            return "Our offices are open Monday through Friday from 9 AM to 5 PM Eastern Time. Is there anything else you need?"
        elif any(w in text for w in ["bye", "goodbye", "hang up", "thank you", "thanks"]):
            return "Thank you so much for calling! Have a wonderful day, and goodbye for now."
        elif any(w in text for w in ["joke", "funny"]):
            return "Why do programmers prefer dark mode? Because light attracts bugs!"
        else:
            return f"I received your message: '{user_text}'. Everything in the voice calling pipeline is working smoothly!"

agent_brain = AgentBrain()
