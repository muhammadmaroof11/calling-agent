import React from 'react';
import { Mic, Cpu, Volume2, Clock, Zap, Info, ArrowRight } from 'lucide-react';

export default function PipelineInspector({ metrics, agentStatus, systemStatus }) {
  const sttMs = metrics?.stt_ms ?? null;
  const llmMs = metrics?.llm_ms ?? null;
  const ttsMs = metrics?.tts_ms ?? null;
  const totalMs = metrics?.total_ms ?? null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white text-base">Calling Agent Pipeline</h3>
        </div>
        <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700">
          Turn-Based Architecture
        </span>
      </div>

      {/* 3 Steps Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1: STT */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            agentStatus === 'listening' || agentStatus === 'transcribing'
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
              : 'bg-slate-800/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" /> 1. Listen (STT)
            </span>
            {sttMs !== null && (
              <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                {sttMs}ms
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-200">
            {systemStatus?.openai_configured ? 'OpenAI Whisper-1' : 'Browser / Audio Capture'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Converts raw microphone audio into transcribed text tokens.
          </p>
        </div>

        {/* Step 2: Brain / LLM */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            agentStatus === 'thinking'
              ? 'bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-950/50'
              : 'bg-slate-800/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> 2. Think (Brain)
            </span>
            {llmMs !== null && (
              <span className="text-xs font-mono text-blue-300 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800">
                {llmMs}ms
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-200">
            {systemStatus?.openai_configured ? systemStatus.llm_model : 'Voice Assistant Brain'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Maintains conversation context &amp; generates phone persona reply.
          </p>
        </div>

        {/* Step 3: TTS */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            agentStatus === 'speaking'
              ? 'bg-violet-950/40 border-violet-500/60 shadow-lg shadow-violet-950/50'
              : 'bg-slate-800/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> 3. Speak (TTS)
            </span>
            {ttsMs !== null && (
              <span className="text-xs font-mono text-violet-300 bg-violet-950/80 px-1.5 py-0.5 rounded border border-violet-800">
                {ttsMs}ms
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-200 truncate">
            {systemStatus?.edge_voice || 'Edge Neural TTS'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Synthesizes conversational text into human-like audio file.
          </p>
        </div>
      </div>

      {/* Latency Bar */}
      {totalMs !== null && (
        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Round-Trip Turn Latency:
            </span>
            <span className="font-mono font-semibold text-amber-300">{totalMs} ms</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            {sttMs > 0 && (
              <div
                style={{ width: `${Math.max(5, (sttMs / totalMs) * 100)}%` }}
                className="bg-emerald-500 h-full"
                title={`STT: ${sttMs}ms`}
              />
            )}
            <div
              style={{ width: `${Math.max(5, (llmMs / totalMs) * 100)}%` }}
              className="bg-blue-500 h-full"
              title={`LLM: ${llmMs}ms`}
            />
            <div
              style={{ width: `${Math.max(5, (ttsMs / totalMs) * 100)}%` }}
              className="bg-violet-500 h-full"
              title={`TTS: ${ttsMs}ms`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
            <span>STT: {sttMs || 0}ms</span>
            <span>LLM: {llmMs || 0}ms</span>
            <span>TTS: {ttsMs || 0}ms</span>
          </div>
        </div>
      )}

      {/* Educational Walkthrough */}
      <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-1.5">
          <Info className="w-4 h-4 text-sky-400" />
          <span>How Calling Agents Work (The Basics)</span>
        </div>
        <p className="text-slate-400 mb-2">
          Every calling agent—whether building customer support, dispatchers, or sales assistants—relies on this basic 3-part loop:
        </p>
        <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800 overflow-x-auto">
          <span>Mic Audio</span>
          <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
          <span className="text-emerald-300">Whisper STT</span>
          <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
          <span className="text-blue-300">LLM Brain</span>
          <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
          <span className="text-violet-300">TTS Audio</span>
          <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
          <span>Speaker</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Next steps to make it more advanced: WebSocket bi-directional streaming, VAD (Voice Activity Detection) to auto-detect silence, and Barge-In (stopping agent speech when caller interrupts).
        </p>
      </div>
    </div>
  );
}
