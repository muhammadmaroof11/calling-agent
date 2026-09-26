# Frontend Craftsmanship & UI Guidelines

All frontend development in this workspace must adhere to the following strict criteria:

1. **Design System & Palette**:
   - Backgrounds: Dark obsidian `#09090b` and `#121216`. No bright neon washes or cheap gradients.
   - Borders: Subtle hairline borders `border-zinc-800/80` or `border-zinc-700/60`.
   - Typography: Clean sans-serif hierarchy with `text-white`, `text-zinc-300`, and `text-zinc-500`.

2. **Component Integrity**:
   - Zero element overlaps: Floating action bars must NEVER sit on top of input fields or call buttons.
   - Clean spacing: Minimum 16px-24px gutters between functional panels.
   - Interactive states: Every button must have clear `:hover`, `:active`, and `:disabled` styling.

3. **ElevenLabs Conversational AI Standard**:
   - Studio split layout: Configuration & Telemetry on the left, Voice Canvas & Dialogue on the right.
   - Responsive multi-state audio waveform visualizer.
   - Push-to-Talk via keyboard spacebar and click/tap.
   - Fallback TTS protection when remote API credits expire.
