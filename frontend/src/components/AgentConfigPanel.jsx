import React, { useState } from 'react';
import {
  Bot,
  Volume2,
  Play,
  Square,
  Cpu,
  Mic,
  Zap,
  Clock,
  Sparkles,
  Sliders,
  SlidersHorizontal,
  Settings2,
  FileText,
  Check,
  Globe,
  Radio,
  HelpCircle
} from 'lucide-react';
import { speakWithBrowserTts } from '../utils/browserTts';

export default function AgentConfigPanel({
  selectedVoice,
  onSelectVoice,
  systemStatus,
  lastMetrics,
  transcriptCount,
}) {
  const [isPlayingPreview, setIsPlayingPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' | 'prompt' | 'telemetry'
  const [stability, setStability] = useState(0.75);
  const [similarity, setSimilarity] = useState(0.85);
  const [firstMessage, setFirstMessage] = useState(
    'Hello! Thank you for calling Voxora. How can I assist you today?'
  );

  const voices = [
    {
      id: 'en-US-AriaNeural',
      name: 'Aria',
      accent: 'US Female',
      description: 'Warm, empathetic & conversational',
      tag: 'Customer Support',
    },
    {
      id: 'en-US-GuyNeural',
      name: 'Guy',
      accent: 'US Male',
      description: 'Confident, clear & professional',
      tag: 'Executive',
    },
    {
      id: 'en-US-JennyNeural',
      name: 'Jenny',
      accent: 'US Female',
      description: 'Energetic, natural & upbeat',
      tag: 'Sales & Outreach',
    },
    {
      id: 'en-GB-SoniaNeural',
      name: 'Sonia',
      accent: 'British Female',
      description: 'Crisp, articulate & formal',
      tag: 'Concierge',
    },
    {
      id: 'en-AU-NatashaNeural',
      name: 'Natasha',
      accent: 'Australian Female',
      description: 'Friendly, warm & approachable',
      tag: 'Receptionist',
    },
  ];

  const handlePreviewVoice = (voiceId, voiceName) => {
    if (isPlayingPreview === voiceId) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingPreview(null);
      return;
    }

    setIsPlayingPreview(voiceId);
    speakWithBrowserTts(
      `Hello! I am ${voiceName}, your conversational assistant powered by Voxora.`,
      () => setIsPlayingPreview(voiceId),
      () => setIsPlayingPreview(null)
    );
  };

  const stt = lastMetrics?.stt_ms ?? null;
  const llm = lastMetrics?.llm_ms ?? null;
  const tts = lastMetrics?.tts_ms ?? null;
  const total = lastMetrics?.total_ms ?? null;

  return (
    <div className="w-full flex flex-col gap-4 text-zinc-200">
      {/* 1. Agent Profile Summary Card (ElevenLabs Studio Style) */}
      <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-white shadow-inner">
                <Bot className="w-5 h-5 text-zinc-100" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121216]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">Voxora Concierge</h2>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/70 font-medium">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Conversational Voice Agent • Inbound Call Handler</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-500 block">AI Stack</span>
            <span className="text-[11px] font-mono font-semibold text-zinc-300">Free Tier (0.00 $/m)</span>
          </div>
        </div>

        {/* Tab Navigation (ElevenLabs Studio Tabs) */}
        <div className="flex items-center gap-1 bg-[#18181f] p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'voice'
                ? 'bg-[#24242f] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice & Persona</span>
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'prompt'
                ? 'bg-[#24242f] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Prompt & Setup</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'telemetry'
                ? 'bg-[#24242f] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Latency</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Voice Persona Selection & Tuning */}
      {activeTab === 'voice' && (
        <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-zinc-300" />
              <span>Select Agent Voice</span>
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">5 Neural Models</span>
          </div>

          {/* Voice Cards Grid */}
          <div className="space-y-2">
            {voices.map((v) => {
              const isSelected = selectedVoice === v.id;
              const isPlaying = isPlayingPreview === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => onSelectVoice(v.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#181822] border-zinc-500 shadow-sm'
                      : 'bg-[#141418] border-zinc-800/80 hover:border-zinc-700 hover:bg-[#18181f]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                        isSelected
                          ? 'bg-white text-black'
                          : 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700'
                      }`}
                    >
                      {v.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{v.name}</span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-[#1c1c24] px-1.5 py-0.2 rounded border border-zinc-800">
                          {v.accent}
                        </span>
                        <span className="text-[10px] text-zinc-500 hidden sm:inline">• {v.tag}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{v.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewVoice(v.id, v.name);
                      }}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isPlaying
                          ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                          : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-zinc-700/80'
                      }`}
                      title={isPlaying ? 'Stop Preview' : 'Play Audio Sample'}
                    >
                      {isPlaying ? (
                        <Square className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                    </button>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Voice Tuning Sliders (ElevenLabs Style) */}
          <div className="pt-3 border-t border-zinc-800/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <span>Voice Stability</span>
              </span>
              <span className="font-mono text-zinc-200">{stability.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={stability}
              onChange={(e) => setStability(parseFloat(e.target.value))}
              className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>Clarity & Similarity Boost</span>
              </span>
              <span className="font-mono text-zinc-200">{similarity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={similarity}
              onChange={(e) => setSimilarity(parseFloat(e.target.value))}
              className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Tab 2: System Prompt & First Message */}
      {activeTab === 'prompt' && (
        <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-bold text-white uppercase tracking-wider block mb-1.5">
              First Greeting Message
            </label>
            <textarea
              rows={2}
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              className="w-full bg-[#18181f] border border-zinc-700/80 focus:border-zinc-500 text-xs text-zinc-100 rounded-xl p-3 outline-none transition-colors resize-none leading-relaxed"
              placeholder="First phrase the agent speaks..."
            />
            <span className="text-[10px] text-zinc-500">Spoken immediately when a caller initiates a call session.</span>
          </div>

          <div className="pt-2 border-t border-zinc-800/60">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                System Persona Instructions
              </label>
              <span className="text-[10px] font-mono text-zinc-500">148 chars</span>
            </div>
            <div className="bg-[#18181f] p-3 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 leading-relaxed font-mono">
              You are Voxora, an articulate and friendly voice calling agent on a live phone call. Keep answers short, conversational, and direct (1 to 3 sentences) without markdown formatting.
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/60">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              Model Settings
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#18181f] p-2.5 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Temperature</span>
                <span className="text-zinc-200 font-mono font-bold">0.6 (Balanced)</span>
              </div>
              <div className="bg-[#18181f] p-2.5 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Max Response</span>
                <span className="text-zinc-200 font-mono font-bold">120 tokens</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Real-Time Latency Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Turnaround Pipeline Latency</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-800/60">
              {total !== null ? `${total} ms total` : 'Ready for Call'}
            </span>
          </div>

          {total !== null ? (
            <div className="space-y-3">
              {/* Segmented Bar */}
              <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                {stt > 0 && (
                  <div
                    style={{ width: `${Math.max(10, (stt / total) * 100)}%` }}
                    className="bg-emerald-500 h-full"
                    title={`STT: ${stt}ms`}
                  />
                )}
                <div
                  style={{ width: `${Math.max(10, (llm / total) * 100)}%` }}
                  className="bg-blue-500 h-full"
                  title={`LLM: ${llm}ms`}
                />
                <div
                  style={{ width: `${Math.max(10, (tts / total) * 100)}%` }}
                  className="bg-violet-500 h-full"
                  title={`TTS: ${tts}ms`}
                />
              </div>

              {/* Individual Stage Cards */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-[#18181f] p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-emerald-400 font-bold text-sm block">{stt || 0} ms</span>
                  <span className="text-[10px] text-zinc-400">STT (Whisper)</span>
                </div>
                <div className="bg-[#18181f] p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-blue-400 font-bold text-sm block">{llm || 0} ms</span>
                  <span className="text-[10px] text-zinc-400">LLM (Gemini)</span>
                </div>
                <div className="bg-[#18181f] p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-violet-400 font-bold text-sm block">{tts || 0} ms</span>
                  <span className="text-[10px] text-zinc-400">TTS (Audio)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-zinc-500 text-xs">
              <Clock className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
              <span>Make a turn or click a starter question to view pipeline latency breakdown.</span>
            </div>
          )}

          <div className="pt-2 border-t border-zinc-800/60 text-xs space-y-1.5 font-mono text-zinc-400">
            <div className="flex justify-between">
              <span>Transcriber:</span>
              <span className="text-zinc-200">Groq Whisper Turbo</span>
            </div>
            <div className="flex justify-between">
              <span>Inference Engine:</span>
              <span className="text-zinc-200">Google Gemini 2.5 Flash</span>
            </div>
            <div className="flex justify-between">
              <span>Voice Synthesizer:</span>
              <span className="text-zinc-200">Fish Audio / Edge Neural</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
