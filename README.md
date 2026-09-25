# 🎙️ Voxora — Minimalist AI Voice Calling Agent

> A beginner-friendly, beautifully designed AI voice calling agent built from first principles with **FastAPI** (Python), **OpenAI Whisper**, **Neural TTS**, and **React**.

---

## 💡 What is an AI Voice Calling Agent?

Every voice calling agent (from simple prototypes to enterprise engines like Retell AI, Vapi, and LiveKit Voice) is built upon a fundamental **3-step cyclical loop**:

```
                       ┌─────────────────────────┐
                       │  Caller Speaks (Audio)  │
                       └────────────┬────────────┘
                                    │
                                    ▼
       [Step 1: STT]      OpenAI Whisper Model
                          Converts voice audio into text tokens
                                    │
                                    ▼
       [Step 2: BRAIN]    LLM (e.g. GPT-4o-mini)
                          Maintains call context & generates reply
                                    │
                                    ▼
       [Step 3: TTS]      Neural Text-to-Speech (Edge-TTS / OpenAI)
                          Synthesizes natural spoken human speech
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │  Caller Hears Response  │
                       └─────────────────────────┘
```

Voxora was intentionally crafted using the **simplest, most transparent turn-based approach** so you can inspect, modify, and master each stage of the pipeline without getting overwhelmed by complex WebRTC or low-level RTP streaming on day one.

---

## ✨ Features

- **🎙️ Real-time Speech-to-Text (STT)**: Direct integration with OpenAI Whisper (`whisper-1`) to transcribe microphone audio chunks.
- **🧠 Conversational Brain (LLM)**: Short, conversational phone persona running on `gpt-4o-mini` with per-session memory.
- **🔊 Realistic Neural TTS**: Microsoft Edge Neural TTS out of the box (100% free, human-like cadence, zero API key required) with optional OpenAI TTS-1 support.
- **📱 Phone Call Simulator UI**:
  - Live call screen with pulsating audio rings and animated waveforms
  - **Tap-to-Speak** and **Hands-Free Auto-Listen** modes
  - Zero-mic quick simulation input (type text to test anytime)
  - Live synchronized transcript with audio replay
- **⚡ Educational Pipeline Inspector**:
  - Real-time latency tracking for each phase (**STT ms**, **LLM ms**, **TTS ms**, and **Total ms**)
  - Architectural breakdown of the calling agent stack
- **🚀 Out-of-the-Box Offline Demo**:
  - Works immediately even *without* an OpenAI API key using an offline mock assistant + Edge TTS, so you can test and explore before adding billing credentials.

---

## 📁 Project Architecture

```
calling-agent/
├── backend/
│   ├── .env                    # Config & API keys
│   ├── .env.example
│   ├── requirements.txt
│   ├── main.py                 # FastAPI REST & audio endpoints
│   ├── core/
│   │   ├── config.py           # App settings & persona prompt
│   │   ├── stt.py              # Step 1: Speech-to-Text (OpenAI Whisper)
│   │   ├── brain.py            # Step 2: Agent Brain (LLM & session memory)
│   │   └── tts.py              # Step 3: Text-to-Speech (Edge-TTS / OpenAI)
│   └── audio_cache/            # Generated agent audio files (.mp3)
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js          # Vite config with API proxy to port 8000
│   └── src/
│       ├── App.jsx             # Main application layout
│       ├── components/
│       │   ├── CallScreen.jsx        # Live phone call dialer & visualizer
│       │   ├── TranscriptView.jsx    # Real-time dialogue feed
│       │   ├── PipelineInspector.jsx # Latency & pipeline inspector
│       │   ├── AudioVisualizer.jsx   # Voice soundwave animation
│       │   └── SettingsModal.jsx     # Voice switcher & API status
│       └── hooks/
│           └── useVoiceCall.js       # Core state hook (recording, player, turns)
│
├── start_backend.bat           # 1-click backend launcher (Windows)
├── start_frontend.bat          # 1-click frontend launcher (Windows)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**

### 2. Backend Setup
1. Open a terminal in the root directory:
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   # source venv/bin/activate

   pip install -r requirements.txt
   ```
2. (Optional) Configure OpenAI API Key:
   Open `backend/.env` and add your key:
   ```env
   OPENAI_API_KEY=sk-proj-your-key-here
   OPENAI_MODEL=gpt-4o-mini
   WHISPER_MODEL=whisper-1
   TTS_PROVIDER=edge-tts
   ```
   > **Note**: If you don't supply an OpenAI key, Voxora automatically runs in **Offline Demo Mode** with Edge-TTS voice synthesis so you can test immediately!

3. Run the Backend:
   ```bash
   python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   Backend will be running at `http://localhost:8000` (API docs at `/docs`).

### 3. Frontend Setup
1. In another terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at:
   ```
   http://localhost:5173  (or 5174)
   ```

---

## 🎮 How to Test the Agent

1. Click **Start Voice Call**.
2. Voxora will connect and introduce itself via voice.
3. Click **Tap to Speak**, say something (e.g., *"Can I schedule an appointment for tomorrow?"*), and click **Click to Send Voice**.
4. Watch the **Pipeline Inspector** at the bottom:
   - Notice the **STT** time (audio transcription)
   - Notice the **Brain** time (LLM response generation)
   - Notice the **TTS** time (speech audio synthesis)
5. Hear Voxora speak the response aloud and see the live transcript update!
6. Turn on **Auto-listen** for a natural back-and-forth hands-free calling conversation.

---

## 🛣️ Roadmap: Making It More Complex

Once you are comfortable with this foundation, you can scale Voxora towards production-grade voice agents:

1. **WebSocket Duplex Streaming**:
   - Stream audio chunks continuously over WebSockets rather than waiting for user to finish recording.
2. **Streaming LLM to Streaming TTS**:
   - Pipe GPT tokens sentence-by-sentence into the TTS engine as they are generated to reduce latency under 500ms.
3. **Voice Activity Detection (VAD)**:
   - Use models like **Silero VAD** in Python or WebAudio VAD in JS to automatically detect when the user starts and stops talking.
4. **Barge-In (Interruption Handling)**:
   - If the user starts talking while the agent is speaking, immediately stop TTS playback and discard the remaining audio buffer.
5. **Function Calling & External Tools**:
   - Give the LLM tools to query an API, book a calendar slot (Google Calendar API), or look up customer data.
6. **Telephony Integration**:
   - Connect Twilio Voice / SIP trunk via Media Streams to allow real phone numbers to call Voxora.

---

## 📄 License
MIT License. Free to use, modify, and build upon!
