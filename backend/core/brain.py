import time
from typing import Dict, List, Tuple
from openai import OpenAI
from backend.core.config import settings

class AgentBrain:
    """
    Manages conversational memory and response generation for calling agent sessions.
    Uses OpenAI (e.g. gpt-4o-mini) when API key is set, or a responsive local fallback agent.
    """
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None
        # In-memory store: { session_id: [ {"role": "system"|"user"|"assistant", "content": "..."} ] }
        self.sessions: Dict[str, List[Dict[str, str]]] = {}

    def is_configured(self) -> bool:
        return bool(self.api_key and self.client)

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
        
        # Append user message
        history.append({"role": "user", "content": user_text})
        
        if self.is_configured():
            try:
                response = self.client.chat.completions.create(
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
                # If OpenAI fails, fall back to safe message
                duration = time.time() - start_time
                reply = f"I heard you say '{user_text}', but my AI brain encountered an error: {str(e)}"
                history.append({"role": "assistant", "content": reply})
                return reply, duration
        
        # Smart local mock voice agent when no OpenAI API key is set
        reply = self._mock_voice_agent(user_text)
        history.append({"role": "assistant", "content": reply})
        duration = time.time() - start_time
        return reply, duration

    def _mock_voice_agent(self, user_text: str) -> str:
        """
        Provides natural voice responses for testing when OpenAI API key is not yet configured.
        """
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
