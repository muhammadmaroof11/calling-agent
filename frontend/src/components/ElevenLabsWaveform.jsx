import React, { useEffect, useRef } from 'react';

export default function ElevenLabsWaveform({ status, isConnected }) {
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';
  const isThinking = status === 'thinking' || status === 'transcribing';
  const barCount = 36;

  return (
    <div className="flex flex-col items-center justify-center py-6 select-none w-full">
      {/* Dynamic 36-bar High-Density Waveform */}
      <div className="flex items-center justify-center gap-[3px] h-20 w-full max-w-md px-4">
        {Array.from({ length: barCount }).map((_, index) => {
          // Calculate natural curved heights (bell-shaped curve from center)
          const mid = barCount / 2;
          const distFromMid = Math.abs(index - mid) / mid;
          const curveFactor = Math.cos(distFromMid * Math.PI * 0.45);
          const delay = (index % 8) * 0.1;
          const baseHeight = 6 + curveFactor * 24;

          const isActive = isSpeaking || isListening;

          return (
            <div
              key={index}
              className={`w-[3px] rounded-full transition-all duration-200 ${
                !isConnected
                  ? 'bg-zinc-800'
                  : isSpeaking
                  ? 'bg-gradient-to-t from-violet-600 via-fuchsia-400 to-white shadow-[0_0_12px_rgba(168,85,247,0.7)]'
                  : isListening
                  ? 'bg-gradient-to-t from-emerald-600 via-teal-300 to-white shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                  : isThinking
                  ? 'bg-gradient-to-t from-amber-500 to-orange-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  : 'bg-zinc-700'
              }`}
              style={{
                height: !isConnected
                  ? '8px'
                  : isActive
                  ? `${Math.max(8, baseHeight * 1.8)}px`
                  : isThinking
                  ? `${Math.max(6, (Math.sin(index * 0.8) + 1) * 12 + 6)}px`
                  : `${Math.max(6, baseHeight * 0.4)}px`,
                animation: isActive
                  ? `pulseWave 0.75s ease-in-out infinite alternate`
                  : isThinking
                  ? `pulseWave 1.2s ease-in-out infinite alternate`
                  : 'none',
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Status Label underneath the waveform */}
      <div className="flex items-center gap-2 mt-3">
        <span
          className={`w-2 h-2 rounded-full ${
            !isConnected
              ? 'bg-zinc-600'
              : isSpeaking
              ? 'bg-violet-400 animate-pulse'
              : isListening
              ? 'bg-emerald-400 animate-ping'
              : isThinking
              ? 'bg-amber-400 animate-pulse'
              : 'bg-emerald-400'
          }`}
        />
        <span className="text-xs font-mono font-medium text-zinc-300">
          {!isConnected
            ? 'Agent Inactive • Press Start Call'
            : isSpeaking
            ? 'Voxora is speaking...'
            : isListening
            ? 'Listening to caller... (Release Space to send)'
            : isThinking
            ? 'Thinking & transcribing audio...'
            : 'Connected • Ready to converse'}
        </span>
      </div>
    </div>
  );
}
