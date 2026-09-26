---
name: elevenlabs-voice-ui
description: >-
  Specialized skill for engineering ElevenLabs-grade Conversational AI and Voice Agent interfaces.
  Provides specifications for voice visualizers (Orb & Waveform), push-to-talk flows, real-time STT/LLM/TTS telemetry,
  persona selectors, and studio-grade audio interaction layouts.
---

# ElevenLabs Conversational AI UI/UX Standard

This skill codifies the exact design patterns, interactions, and aesthetic conventions used in ElevenLabs' Conversational AI Studio (`ui.elevenlabs.io`).

## 1. Architectural Anatomy of ElevenLabs Studio

ElevenLabs Voice Studio comprises 4 foundational zones:

```
+---------------------------------------------------------------------------------------+
|  [|| VOXORA]  Agents / Customer Concierge   [Public] [v1.2]      [Telemetry] [Settings] |
+---------------------------------------------------------------------------------------+
|  LEFT PANEL: Agent Configuration            |  RIGHT PANEL: Interactive Stage        |
|  - Agent Identity & Status                  |  - High-Density Responsive Visualizer   |
|  - Voice Persona Switcher & Audio Samples   |  - Dynamic Status (Listening/Speaking) |
|  - System Prompt & Temperature              |  - Primary Call Controls (PTT [Space])  |
|  - Latency Pipeline Breakdown (STT/LLM/TTS) |  - Live Turn-by-Turn Dialogue Stream    |
|                                             |  - Text Simulation Input & Shortcuts   |
+---------------------------------------------------------------------------------------+
```

## 2. Voice Visualization Physics

ElevenLabs interfaces utilize two primary visualizer motifs:

1. **Fluid Equalizer Waveform**:
   - 32 to 40 symmetric bars distributed across a Gaussian bell curve.
   - Idle State: Subtle undulating bars (`height: 8px - 14px`, zinc-700).
   - Listening State: Vibrant emerald/teal glow with active mic sensitivity.
   - Thinking State: Shimmering amber/gold ripple animation.
   - Speaking State: High-amplitude violet/fuchsia/white bars with dynamic glow filters (`shadow-[0_0_12px_rgba(168,85,247,0.7)]`).

2. **Orb / Radial Pulse Ring**:
   - Multi-layered concentric rings with smooth CSS scaling transitions.
   - Outer aura with `blur-xl` and opacity transitions corresponding to conversational state.

## 3. Conversational State Machine

Always maintain unambiguous visual and interactive state transitions:

State       | Visual Cue              | Status Label                   | Controls Available
:---------- | :---------------------- | :----------------------------- | :----------------------------------
**Idle**    | Dim zinc waveform       | "Agent Inactive • Click Start" | `[Start Voice Call]` (White button)
**Listening**| Glowing Emerald Waves   | "Listening to caller..."       | `[Tap to Send]` or `Release [Space]`
**Thinking**| Pulsing Amber Shimmer   | "Thinking & synthesizing..."   | Disabled inputs, spinning indicator
**Speaking**| Blooming Violet Bars    | "Voxora is speaking..."        | `[Interrupt / Replay]`

## 4. Latency Breakdown Telemetry

Voice calling requires sub-second perceived latency. Always display real-time telemetry:
- **STT (Speech-to-Text)**: e.g. Groq Whisper Turbo (`~120-180ms`)
- **LLM (Reasoning Brain)**: e.g. Gemini 2.5 Flash (`~250-400ms`)
- **TTS (Audio Synthesis)**: e.g. Fish Audio / Edge Neural (`~180-300ms`)
- **Total Turnaround Time**: Displayed as a segmented multi-color progress bar with millisecond readouts.
