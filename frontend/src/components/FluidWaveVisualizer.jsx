import React, { useEffect, useRef } from 'react';

export default function FluidWaveVisualizer({ status, height = 52 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let step = 0;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      // Amplitude & speed based on state
      const isAudible = status === 'listening' || status === 'speaking';
      const baseAmp =
        status === 'speaking'
          ? 18
          : status === 'listening'
          ? 14
          : status === 'thinking' || status === 'transcribing'
          ? 7
          : 3;
      const speed = isAudible ? 0.08 : 0.03;
      step += speed;

      const waves = [
        {
          color:
            status === 'speaking'
              ? 'rgba(168, 85, 247, 0.75)'
              : status === 'listening'
              ? 'rgba(16, 185, 129, 0.75)'
              : 'rgba(99, 102, 241, 0.4)',
          freq: 0.03,
          amp: baseAmp,
          phase: step,
        },
        {
          color:
            status === 'speaking'
              ? 'rgba(236, 72, 153, 0.55)'
              : status === 'listening'
              ? 'rgba(20, 184, 166, 0.55)'
              : 'rgba(147, 51, 234, 0.3)',
          freq: 0.02,
          amp: baseAmp * 0.75,
          phase: step * 0.8 + 1.2,
        },
        {
          color:
            status === 'speaking'
              ? 'rgba(99, 102, 241, 0.45)'
              : status === 'listening'
              ? 'rgba(52, 211, 153, 0.35)'
              : 'rgba(59, 130, 246, 0.25)',
          freq: 0.04,
          amp: baseAmp * 0.5,
          phase: step * 1.3 + 2.4,
        },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = wave.color;

        for (let x = 0; x < width; x++) {
          // Gaussian attenuation envelope to taper wave edges
          const mid = width / 2;
          const envelope = Math.exp(-Math.pow((x - mid) / (width * 0.38), 2));
          const y = h / 2 + Math.sin(x * wave.freq + wave.phase) * wave.amp * envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [status]);

  return (
    <div className="w-full flex justify-center items-center py-1">
      <canvas
        ref={canvasRef}
        width={340}
        height={height}
        className="max-w-full drop-shadow-[0_0_15px_rgba(139,92,246,0.35)]"
      />
    </div>
  );
}
