import React from 'react';

export default function AudioVisualizer({ status }) {
  // Determine animation intensity based on agent status
  const isActive = status === 'listening' || status === 'speaking';
  const barCount = 18;

  return (
    <div className="flex items-center justify-center gap-1.5 h-12 py-2">
      {Array.from({ length: barCount }).map((_, index) => {
        // Vary heights and delays for a realistic waveform look
        const delay = (index % 5) * 0.15;
        const baseHeight = 8 + (Math.sin(index * 0.6) + 1) * 12;

        return (
          <div
            key={index}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              status === 'speaking'
                ? 'bg-gradient-to-t from-violet-500 to-fuchsia-400'
                : status === 'listening'
                ? 'bg-gradient-to-t from-emerald-500 to-teal-400'
                : status === 'thinking' || status === 'transcribing'
                ? 'bg-gradient-to-t from-amber-400 to-orange-400'
                : 'bg-slate-700'
            }`}
            style={{
              height: isActive ? `${baseHeight * 1.6}px` : `${Math.max(6, baseHeight * 0.35)}px`,
              animation: isActive ? `pulseWave 0.8s ease-in-out infinite alternate` : 'none',
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
