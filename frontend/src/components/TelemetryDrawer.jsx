import React from 'react';
import { X, Mic, Cpu, Volume2, Clock, Zap, Gauge, Sparkles, Activity } from 'lucide-react';

export default function TelemetryDrawer({
  isOpen,
  onClose,
  metrics,
  systemStatus,
}) {
  if (!isOpen) return null;

  const stt = metrics?.stt_ms ?? null;
  const llm = metrics?.llm_ms ?? null;
  const tts = metrics?.tts_ms ?? null;
  const total = metrics?.total_ms ?? null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#0b0f19]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Telemetry &amp; Latency</h3>
            <p className="text-[11px] text-slate-400">Real-time voice pipeline diagnostics</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* Total Latency Meter Card */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Round-Trip Latency:</span>
            </span>
            <span className="font-mono text-base font-bold text-amber-300">
              {total !== null ? `${total} ms` : 'Ready for Turn'}
            </span>
          </div>

          {total !== null && (
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner">
                {stt > 0 && (
                  <div
                    style={{ width: `${Math.max(8, (stt / total) * 100)}%` }}
                    className="bg-emerald-500 h-full"
                    title={`STT: ${stt}ms`}
                  />
                )}
                <div
                  style={{ width: `${Math.max(8, (llm / total) * 100)}%` }}
                  className="bg-blue-500 h-full"
                  title={`LLM: ${llm}ms`}
                />
                <div
                  style={{ width: `${Math.max(8, (tts / total) * 100)}%` }}
                  className="bg-violet-500 h-full"
                  title={`TTS: ${tts}ms`}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span className="text-emerald-400">STT: {stt || 0}ms</span>
                <span className="text-blue-400">Brain: {llm || 0}ms</span>
                <span className="text-violet-400">TTS: {tts || 0}ms</span>
              </div>
            </div>
          )}
        </div>

        {/* 3 Stages Cards */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pipeline Architecture
          </h4>

          {/* STT */}
          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-xs text-white">1. Listen (STT)</p>
                <p className="text-[11px] text-slate-400">{systemStatus?.stt_provider || 'Groq Whisper Turbo'}</p>
              </div>
            </div>
            <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-800">
              {stt !== null ? `${stt}ms` : '--'}
            </span>
          </div>

          {/* Brain */}
          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-xs text-white">2. Think (Brain)</p>
                <p className="text-[11px] text-slate-400">{systemStatus?.llm_provider || 'Gemini 2.5 Flash'}</p>
              </div>
            </div>
            <span className="font-mono text-xs font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-lg border border-blue-800">
              {llm !== null ? `${llm}ms` : '--'}
            </span>
          </div>

          {/* TTS */}
          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-xs text-white">3. Speak (TTS)</p>
                <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                  {systemStatus?.tts_provider || 'Fish Audio / User TTS'}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-semibold text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded-lg border border-violet-800">
              {tts !== null ? `${tts}ms` : '--'}
            </span>
          </div>
        </div>

        {/* Free Stack Callout */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950/60 rounded-2xl border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-white">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>100% Free AI Infrastructure</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            By running Groq Whisper + Gemini Flash + Edge-TTS/Fish Audio, you achieve enterprise-grade voice conversations at zero credit cost.
          </p>
        </div>
      </div>
    </div>
  );
}
