import React from 'react';
import { Mic, Radio, Sparkles, Volume2 } from 'lucide-react';
import FluidWaveVisualizer from './FluidWaveVisualizer';

export default function VoiceOrb({ status, callState }) {
  const isListening = status === 'listening';
  const isSpeaking = status === 'speaking';
  const isThinking = status === 'thinking' || status === 'transcribing';
  const isConnected = callState === 'connected';

  // Dynamic visualizer bars
  const barCount = 28;

  return (
    <div className="relative flex flex-col items-center justify-center py-4 select-none w-full">
      {/* Outer Ambient Glow Mesh */}
      <div
        className={`absolute w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isListening
            ? 'bg-emerald-500/20 scale-110'
            : isSpeaking
            ? 'bg-violet-600/25 scale-120'
            : isThinking
            ? 'bg-amber-500/20 scale-105'
            : 'bg-zinc-800/10 scale-95'
        }`}
      />

      {/* Concentric Aura Rings */}
      <div className="relative flex items-center justify-center">
        {isConnected && (
          <>
            {/* Outer Ripple 1 */}
            <div
              className={`absolute rounded-full border transition-all pointer-events-none ${
                isSpeaking
                  ? 'w-52 h-52 border-violet-500/30 animate-ping'
                  : isListening
                  ? 'w-52 h-52 border-emerald-500/30 animate-ping'
                  : 'w-44 h-44 border-zinc-800/60'
              }`}
              style={{ animationDuration: isSpeaking ? '2.4s' : '3s' }}
            />

            {/* Mid Aura Ring 2 */}
            <div
              className={`absolute rounded-full border transition-all pointer-events-none ${
                isSpeaking
                  ? 'w-40 h-40 border-fuchsia-500/40'
                  : isListening
                  ? 'w-40 h-40 border-teal-400/40'
                  : isThinking
                  ? 'w-40 h-40 border-amber-400/30'
                  : 'w-36 h-36 border-zinc-800'
              }`}
              style={{
                animation: isConnected ? 'auraBreath 3s ease-in-out infinite' : 'none',
              }}
            />

            {/* Spinning Gradient Halo for Thinking state */}
            {isThinking && (
              <div
                className="absolute w-36 h-36 rounded-full border-2 border-transparent border-t-amber-400 border-r-orange-400 animate-spin pointer-events-none"
                style={{ animationDuration: '1.2s' }}
              />
            )}
          </>
        )}

        {/* Central 3D Glowing Orb */}
        <div
          className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl cursor-pointer ${
            !isConnected
              ? 'bg-[#18181f] border border-zinc-700/60 text-zinc-500'
              : isSpeaking
              ? 'bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-indigo-500 text-white shadow-[0_0_40px_rgba(168,85,247,0.5)] scale-105'
              : isListening
              ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-white shadow-[0_0_40px_rgba(16,185,129,0.5)] scale-105'
              : isThinking
              ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-[0_0_35px_rgba(245,158,11,0.45)]'
              : 'bg-gradient-to-tr from-zinc-800 via-[#1c1c24] to-zinc-900 border border-zinc-700 text-white shadow-[0_0_25px_rgba(255,255,255,0.05)]'
          }`}
          style={{
            animation: isConnected && !isThinking ? 'floatOrb 4s ease-in-out infinite' : 'none',
          }}
        >
          {/* Inner Glare / Specular shine */}
          <div className="absolute top-2 left-3 w-8 h-5 bg-white/20 rounded-full blur-xs transform -rotate-12 pointer-events-none" />

          {/* Center Dynamic Icon */}
          <div className="relative z-10 transition-transform duration-300">
            {isListening ? (
              <Mic className="w-9 h-9 text-white animate-pulse" />
            ) : isSpeaking ? (
              <Radio className="w-9 h-9 text-white animate-pulse" />
            ) : isThinking ? (
              <Sparkles className="w-9 h-9 text-white animate-spin" style={{ animationDuration: '3s' }} />
            ) : isConnected ? (
              <Volume2 className="w-9 h-9 text-white/90" />
            ) : (
              <Radio className="w-8 h-8 text-zinc-500" />
            )}
          </div>
        </div>
      </div>

      {/* Dynamic 28-Band Audio Waveform Spectrum */}
      <div className="flex items-center justify-center gap-1.5 h-8 mt-4 z-10">
        {Array.from({ length: barCount }).map((_, index) => {
          const delay = (index % 6) * 0.12;
          const baseHeight = 5 + (Math.sin(index * 0.5) + 1) * 8;
          const isActive = isListening || isSpeaking;

          return (
            <div
              key={index}
              className={`w-1 rounded-full transition-all duration-300 ${
                isSpeaking
                  ? 'bg-gradient-to-t from-violet-500 to-fuchsia-300 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                  : isListening
                  ? 'bg-gradient-to-t from-emerald-500 to-teal-200 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : isThinking
                  ? 'bg-gradient-to-t from-amber-400 to-orange-300'
                  : 'bg-zinc-800'
              }`}
              style={{
                height: isActive
                  ? `${Math.min(32, baseHeight * 1.5)}px`
                  : `${Math.max(4, baseHeight * 0.3)}px`,
                animation: isActive ? 'pulseWave 0.75s ease-in-out infinite alternate' : 'none',
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
