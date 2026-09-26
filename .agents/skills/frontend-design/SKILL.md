---
name: frontend-design
description: >-
  Premier SaaS Frontend Design skill for crafting world-class modern web applications.
  Enforces modern design taste, Linear/ElevenLabs/Vercel design systems, dark-theme obsidian aesthetics,
  anti-AI slop principles, responsive grids, and micro-interactions.
---

# SaaS Frontend Design Guidelines & Best Practices

This skill guides the design and implementation of modern SaaS platforms, matching the visual polish and user experience of industry-leading products like ElevenLabs, Linear, Vercel, and Raycast.

## 1. The Core Aesthetic: Refined Obsidian Dark Mode

Avoid generic "AI-slop" dark modes (blurry glowing purple blobs on pure black `#000000` with mismatched borders). Instead, implement:

- **Base Canvas**: Deep zinc/slate `#09090b` or `#0b0b0e`. Never pure stark black unless intentionally using OLED contrast.
- **Card & Surface Hierarchy**:
  - Base: `#09090b`
  - Layer 1 (Primary Cards): `#121216` or `#141418` with subtle border `border-zinc-800/80` (`#27272a`).
  - Layer 2 (Elevated / Nested): `#18181f` or `#1c1c24` with border `border-zinc-700/60`.
  - Layer 3 (Active / Focus): `#22222d` or subtle zinc highlight.
- **Borders & Dividers**:
  - Razor-sharp 1px borders using `border-zinc-800/80` or `rgba(255, 255, 255, 0.08)`.
  - Avoid thick, blurry outlines or random rainbow borders.

## 2. Typography & Hierarchy

- **Font Family**: Inter, Geist, or modern system font stack (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`).
- **Scale**:
  - H1/Page Titles: 20px - 24px, font-bold or font-semibold, tight tracking (`tracking-tight`).
  - Section Headings: 13px - 14px, uppercase or title case, tracking-wider, text-zinc-400 or text-zinc-300 font-semibold.
  - Body Text: 12px - 13px, leading-relaxed, text-zinc-300.
  - Secondary/Meta: 11px, font-mono or font-medium, text-zinc-400.
- **Contrast**:
  - Primary text: `text-white` or `text-zinc-100`.
  - Secondary text: `text-zinc-400`.
  - Tertiary / Muted: `text-zinc-500`.

## 3. Layout Structure: Studio / Bento Grid

- Standard SaaS studio layout features a split workspace:
  - **Left Panel (35-40% width)**: Controls, configurations, voice persona switcher, system prompt, and telemetry.
  - **Right Panel (60-65% width)**: Interactive stage, live audio visualizer, call controls, and streaming dialogue feed.
- **Zero Layout Collisions**:
  - Never place floating absolute docks directly over input bars or primary action buttons.
  - Fixed elements must have dedicated layout bounds with calculated margins and padding.

## 4. Interactive Feedback & Micro-Interactions

- **Button States**:
  - Primary: High-contrast solid (e.g. `bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all`).
  - Secondary: Muted surface with border (`bg-[#18181f] text-zinc-200 hover:bg-zinc-800 border-zinc-700/60`).
  - Destructive: Clean crimson/rose (`bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30`).
- **Loading & Processing States**:
  - Pulsing status dots (`w-2 h-2 rounded-full bg-emerald-500 animate-pulse`).
  - Synchronized audio wave equalizers or orbital ripples.

## 5. Anti-AI Slop Checklist

- [x] No oversized, empty glowing purple voids.
- [x] No overlapping action buttons or clashing inputs.
- [x] No generic placeholder cards with zero utility.
- [x] Clear real-time status indication (Connected, Listening, Thinking, Speaking).
- [x] Tactile keyboard shortcuts clearly badged (e.g., `[Space]` Push-to-Talk).
- [x] Responsive layout adapting smoothly from mobile to 4K displays.
