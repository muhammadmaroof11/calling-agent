# 🎙️ Voxora — Conversational AI Voice Calling Agent

> A studio-grade, zero-cost conversational voice calling platform inspired by **ElevenLabs Conversational AI** (`ui.elevenlabs.io`), built with **FastAPI** (Python 3.10+), **React** (Vite + Tailwind CSS), and a multi-tiered free AI pipeline.

---

## ⚡ Architecture & Free AI Pipeline

Voxora executes a sub-second turn-based conversational voice loop without requiring paid API credits:

```
                        ┌─────────────────────────────────┐
                        │     Caller Speaks (Microphone)  │
                        └────────────────┬────────────────┘
                                         │  WebM / WAV Audio
                                         ▼
        [Step 1: STT]         Groq Whisper Large v3 Turbo
                              Ultra-fast sub-200ms speech-to-text
                                         │
                                         ▼
        [Step 2: BRAIN]       Google Gemini 2.5 Flash
                              Reasoning agent persona & turn context
                                         │
                                         ▼
        [Step 3: TTS]         Fish Audio + Edge-TTS Neural Fallback
                              Zero-failure speech synthesis (.mp3)
                                         │
                                         ▼
                        ┌─────────────────────────────────┐
                        │   Caller Hears Natural Voice    │
                        └─────────────────────────────────┘
```

### 1. Speech-to-Text (STT)
- **Engine**: Groq Cloud Whisper Turbo (`whisper-large-v3-turbo`)
- **Latency**: ~100–180ms
- **Fallback**: Local Whisper or mock transcriber for offline testing.

### 2. Conversational Brain (LLM)
- **Engine**: Google Gemini 2.5 Flash (`gemini-2.5-flash`)
- **Persona**: Natural phone assistant (concise 1–3 sentence responses, conversational tone, conversational grounding).
- **Session Memory**: In-memory turn tracking per call session.

### 3. Text-to-Speech (TTS) & Resilient Fallback
- **Tier 1 (High Fidelity)**: Fish Audio API (`s2t-api.fish.audio`).
- **Tier 2 (Server Fallback)**: Microsoft Edge Neural TTS (`edge-tts` — 100% free, natural cadence, zero API credits required). Automatically activates if Fish Audio credits return `402 Insufficient Credit`.
- **Tier 3 (Browser Fallback)**: Client-side `window.speechSynthesis` for continuous audio playback if backend network drops.

---

## ✨ Features & ElevenLabs Studio Interface

- **🎛️ ElevenLabs-Style Studio Split Layout**:
  - **Left Panel (Agent Configuration & Persona)**:
    - Selectable voice cards (Aria, Guy, Jenny, Sonia, Natasha) with instant audio preview play buttons.
    - ElevenLabs-style sliders for **Voice Stability** and **Similarity / Clarity Boost**.
    - First Greeting Message and System Persona Prompt editor.
    - Segmented latency telemetry breakdown (STT ms, LLM ms, TTS ms, Total ms).
  - **Right Panel (Conversational Voice Stage)**:
    - High-density **36-Bar Gaussian Waveform Equalizer** with state-reactive glow.
    - Fluid **3D Concentric Voice Orb** with ripple aura physics.
    - Top stage switcher: Toggle between `[ Wave | Orb ]` visualizers on the fly.
    - Spacebar Push-to-Talk (`[Space]` hotkey) and hands-free **Auto-Listen** mode.
    - Live Turn-by-Turn Dialogue Stream with audio replay for every agent response.
    - Zero-mic text simulation bar to test conversational turns by typing.
- **🎨 Obsidian Dark Design System**:
  - Custom design system strictly adhering to modern SaaS taste (`#09090b` canvas, razor-sharp `#27272a` borders, zero floating element collisions).
  - Enforced by workspace skills: [`.agents/skills/frontend-design`](.agents/skills/frontend-design/SKILL.md) and [`.agents/skills/elevenlabs-voice-ui`](.agents/skills/elevenlabs-voice-ui/SKILL.md).

---

## 📁 Repository Structure

```
calling-agent/
├── .agents/
│   ├── rules/
│   │   └── frontend-guidelines.md         # Workspace UI standards & guidelines
│   └── skills/
│       ├── frontend-design/SKILL.md       # SaaS frontend design skill
│       └── elevenlabs-voice-ui/SKILL.md   # ElevenLabs voice studio design specs
│
├── backend/
│   ├── main.py                            # FastAPI app & REST endpoints
│   ├── requirements.txt                   # Python dependencies
│   ├── .env                               # Port 8002 & API keys (Groq, Gemini, Fish)
│   ├── .env.example
│   ├── audio_cache/                       # Synthesized agent .mp3 audio cache
│   └── core/
│       ├── config.py                      # App settings & default prompts
│       ├── stt.py                         # Groq Whisper STT integration
│       ├── brain.py                       # Google Gemini 2.5 Flash LLM integration
│       └── tts.py                         # Fish Audio + Edge Neural TTS fallback
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js                     # Vite dev server (API proxy to port 8002)
│   ├── src/
│   │   ├── App.jsx                        # Studio header & 2-column layout
│   │   ├── index.css                      # Obsidian matte palette & keyframe animations
│   │   ├── components/
│   │   │   ├── AgentConfigPanel.jsx       # Studio persona, voice cards & sliders
│   │   │   ├── ConversationalPlayground.jsx# Visualizer stage, call controls & transcript
│   │   │   ├── ElevenLabsWaveform.jsx     # 36-bar dynamic Gaussian equalizer
│   │   │   ├── VoiceOrb.jsx               # Concentric undulating fluid Voice Orb
│   │   │   ├── FluidWaveVisualizer.jsx    # Harmonic SVG sine wave
│   │   │   └── SettingsModal.jsx          # Studio configuration modal
│   │   ├── hooks/
│   │   │   └── useVoiceCall.js            # Call state machine, PTT, audio recording
│   │   └── utils/
│   │       └── browserTts.js              # Client-side fallback audio synthesizer
│
├── start_backend.bat                      # Windows 1-click backend launcher (Port 8002)
├── start_frontend.bat                     # Windows 1-click frontend launcher (Vite)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**

### 2. Environment Configuration
Create or edit `backend/.env`:
```env
# Backend Server Configuration
HOST=127.0.0.1
PORT=8002

# Groq Cloud API (Whisper Turbo STT)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Google Gemini API (Gemini 2.5 Flash Brain)
GEMINI_API_KEY=AIzaSy_your_gemini_api_key_here

# Fish Audio API (Optional - automatically falls back to Edge-TTS if credits expire)
FISH_AUDIO_API_KEY=sk-fish_your_fish_audio_key_here
```

### 3. Start Backend (Port 8002)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8002
```
*Or simply run `start_backend.bat` on Windows.*

### 4. Start Frontend
```powershell
cd frontend
npm install
npm run dev
```
*Or simply run `start_frontend.bat` on Windows.*

Open **`http://localhost:5173/`** (or the port Vite outputs) in your browser.

---

## 📡 API Reference

The backend runs on `http://127.0.0.1:8002` with interactive OpenAPI docs at `/docs`:

Endpoint | Method | Description
:---|:---|:---
`/api/health` | `GET` | Health check & system provider status
`/api/call/voice-turn` | `POST` | Accepts multipart `audio` file; returns transcript, reply text, audio URL, and latency metrics
`/api/call/text-turn` | `POST` | Accepts JSON `{"text": "...", "session_id": "...", "voice_id": "..."}`; runs Brain + TTS
`/api/audio/{filename}` | `GET` | Streams synthesized MP3 audio file
`/api/voices` | `GET` | Lists available neural voice personas

---

## ⌨️ Keyboard Shortcuts & Interactions

Shortcut | Action
:---|:---
`[Space]` (Hold) | **Push-To-Talk**: Speak while holding; release to immediately transcribe and process turn
`Auto-Listen` | **Hands-Free Mode**: Automatically listens and sends speech turns in a continuous cycle
`Wave / Orb` | Toggle between ElevenLabs Gaussian Waveform and Fluid Voice Orb
`Export` | Download full conversation transcript as a `.txt` log

---

## 📄 License

MIT License — Feel free to use, modify, and build upon this project for learning or production.
