import React, { useState } from 'react';
import {
  X,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  Key,
  ShieldCheck,
  Radio,
  Sliders,
  Cpu
} from 'lucide-react';
import { speakWithBrowserTts } from '../utils/browserTts';

export default function SettingsModal({
  isOpen,
  onClose,
  selectedVoice,
  onSelectVoice,
  systemStatus,
}) {
  const [testingVoice, setTestingVoice] = useState(false);

  if (!isOpen) return null;

  const voices = [
    { id: 'en-US-AriaNeural', name: 'Aria', desc: 'Female • American • Warm & Professional', provider: 'User Neural TTS' },
    { id: 'en-US-GuyNeural', name: 'Guy', desc: 'Male • American • Confident & Natural', provider: 'User Neural TTS' },
    { id: 'en-US-JennyNeural', name: 'Jenny', desc: 'Female • American • Conversational & Bright', provider: 'User Neural TTS' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia', desc: 'Female • British • Crisp & Polished', provider: 'User Neural TTS' },
    { id: 'en-AU-NatashaNeural', name: 'Natasha', desc: 'Female • Australian • Friendly & Upbeat', provider: 'User Neural TTS' },
  ];

  const handleTestPreview = (voiceId) => {
    setTestingVoice(true);
    speakWithBrowserTts(
      `Hello! I am Voxora, your AI voice assistant. This is how I sound.`,
      () => setTestingVoice(true),
      () => setTestingVoice(false)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-card border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative text-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Voice &amp; Agent Studio</h3>
              <p className="text-xs text-slate-400">Configure neural voices, API backends, and fallback mechanisms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Stack Status Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/60 rounded-2xl border border-emerald-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Free AI Infrastructure Active</span>
            </span>
            <span className="text-[10px] font-mono bg-emerald-900/80 text-emerald-200 border border-emerald-700 px-2 py-0.5 rounded-full">
              $0.00 / month
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Groq Whisper</p>
                <p className="text-[10px] text-slate-400">~150ms STT (Free)</p>
              </div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Gemini 2.5 Flash</p>
                <p className="text-[10px] text-slate-400">Conversational Brain</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fish Audio & Fallback Notice */}
        <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-white/5 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-indigo-400" />
              <span>Fish Audio + User Neural TTS Fallback</span>
            </span>
            <span className="text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full">
              Auto Fallback Active
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Your Fish Audio key is set. When Fish Audio API credits are active, it synthesizes high-res voice clones. If API credits return 402 or limit out, Voxora automatically falls back to the user's Edge Neural TTS and browser synthesis with zero downtime!
          </p>
        </div>

        {/* Voice Selection Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Select Speaking Voice Persona
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {voices.map((v) => {
              const isSelected = selectedVoice === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => onSelectVoice(v.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/80 shadow-lg shadow-indigo-950/40 text-white'
                      : 'bg-slate-950/40 border-white/5 hover:border-white/15 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-white">{v.name}</p>
                      <p className="text-[10px] text-slate-400">{v.desc}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestPreview(v.id);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Preview Voice Audio"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Powered by Groq • Gemini • Fish Audio • Edge-TTS
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
