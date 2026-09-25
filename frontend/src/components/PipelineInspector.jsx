import React from 'react';
import { Mic, Cpu, Volume2, Clock, Zap, Info, ArrowRight, Gauge, ShieldCheck, Sparkles } from 'lucide-react';

export default function PipelineInspector({ metrics, agentStatus, systemStatus }) {
  const sttMs = metrics?.stt_ms ?? null;
  const llmMs = metrics?.llm_ms ?? null;
  const ttsMs = metrics?.tts_ms ?? null;
  const totalMs = metrics?.total_ms ?? null;

  const getLatencyRating = (total) => {
    if (total === null) return null;
    if (total < 1000) return { label: 'Ultra Fast (<1s)', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-700' };
    if (total < 2500) return { label: 'Fast Responsive', color: 'text-teal-400 bg-teal-950/80 border-teal-700' };
    return { label: 'Normal Turn', color: 'text-amber-400 bg-amber-950/80 border-amber-700' };
  };

  const rating = getLatencyRating(totalMs);

  return (
    <div className="glass-card rounded-3xl p-6 shadow-2xl flex flex-col gap-6 border border-white/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span>Telemetry &amp; Voice Pipeline</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                100% Free AI Tier
              </span>
            </h3>
            <p className="text-xs text-slate-400">Live latency breakdown across STT, LLM reasoning, and neural voice synthesis</p>
          </div>
        </div>

        {rating && (
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-3 py-1 rounded-full border ${rating.color}`}>
              {rating.label}
            </span>
          </div>
        )}
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: STT */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            agentStatus === 'listening' || agentStatus === 'transcribing'
              ? 'bg-emerald-950/50 border-emerald-500/70 shadow-xl shadow-emerald-950/50'
              : 'bg-slate-900/60 border-white/5'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Mic className="w-4 h-4" /> 1. Listen (STT)
            </span>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-lg border border-emerald-800/80">
              {sttMs !== null ? `${sttMs}ms` : '--'}
            </span>
          </div>
          <p className="text-xs font-semibold text-white">
            {systemStatus?.stt_provider || 'Groq Whisper Turbo'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Ultra-fast speech transcription powered by Groq LPU hardware running Whisper Large v3.
          </p>
        </div>

        {/* Step 2: Brain / LLM */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            agentStatus === 'thinking'
              ? 'bg-blue-950/50 border-blue-500/70 shadow-xl shadow-blue-950/50'
              : 'bg-slate-900/60 border-white/5'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> 2. Think (Brain)
            </span>
            <span className="text-xs font-mono text-blue-300 bg-blue-950 px-2 py-0.5 rounded-lg border border-blue-800/80">
              {llmMs !== null ? `${llmMs}ms` : '--'}
            </span>
          </div>
          <p className="text-xs font-semibold text-white">
            {systemStatus?.llm_provider || 'Google Gemini 2.5 Flash'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Maintains conversation context and formats concise, conversational telephone dialogue.
          </p>
        </div>

        {/* Step 3: TTS */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            agentStatus === 'speaking'
              ? 'bg-violet-950/50 border-violet-500/70 shadow-xl shadow-violet-950/50'
              : 'bg-slate-900/60 border-white/5'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" /> 3. Speak (TTS)
            </span>
            <span className="text-xs font-mono text-violet-300 bg-violet-950 px-2 py-0.5 rounded-lg border border-violet-800/80">
              {ttsMs !== null ? `${ttsMs}ms` : '--'}
            </span>
          </div>
          <p className="text-xs font-semibold text-white truncate">
            {systemStatus?.tts_provider || 'Fish Audio / User Neural TTS'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Synthesizes spoken audio using Fish Audio with automatic fallback to user's neural voice.
          </p>
        </div>
      </div>

      {/* Latency Bar */}
      {totalMs !== null && (
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Full Round-Trip Turn Latency:</span>
            </span>
            <span className="font-mono font-bold text-amber-300 text-sm">{totalMs} ms</span>
          </div>

          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner">
            {sttMs > 0 && (
              <div
                style={{ width: `${Math.max(6, (sttMs / totalMs) * 100)}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`STT: ${sttMs}ms`}
              />
            )}
            <div
              style={{ width: `${Math.max(6, (llmMs / totalMs) * 100)}%` }}
              className="bg-blue-500 h-full transition-all"
              title={`LLM: ${llmMs}ms`}
            />
            <div
              style={{ width: `${Math.max(6, (ttsMs / totalMs) * 100)}%` }}
              className="bg-violet-500 h-full transition-all"
              title={`TTS: ${ttsMs}ms`}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 pt-1 font-mono">
            <span className="text-emerald-400">STT: {sttMs || 0}ms</span>
            <span className="text-blue-400">Brain: {llmMs || 0}ms</span>
            <span className="text-violet-400">TTS: {ttsMs || 0}ms</span>
          </div>
        </div>
      )}

      {/* Architecture Flow Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950/80 border border-white/5 text-xs text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>How This Architecture Scales to Production</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            By combining Groq's zero-cost Whisper with Gemini Flash and Neural TTS, you get enterprise-speed voice response with zero API subscription costs.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono bg-slate-900/90 border border-white/10 px-3 py-2 rounded-xl text-slate-300 flex-shrink-0">
          <span>Mic</span>
          <ArrowRight className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-300">Groq STT</span>
          <ArrowRight className="w-3 h-3 text-blue-400" />
          <span className="text-blue-300">Gemini</span>
          <ArrowRight className="w-3 h-3 text-violet-400" />
          <span className="text-violet-300">Neural TTS</span>
        </div>
      </div>
    </div>
  );
}
