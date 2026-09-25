import React from 'react';
import { X, Key, Volume2, ShieldCheck, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  selectedVoice,
  onSelectVoice,
  systemStatus,
}) {
  if (!isOpen) return null;

  const edgeVoices = [
    { id: 'en-US-AriaNeural', name: 'Aria (Female, American - Warm & Professional)' },
    { id: 'en-US-GuyNeural', name: 'Guy (Male, American - Confident & Natural)' },
    { id: 'en-US-JennyNeural', name: 'Jenny (Female, American - Conversational)' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia (Female, British - Elegant & Crisp)' },
    { id: 'en-AU-NatashaNeural', name: 'Natasha (Female, Australian - Friendly)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-base">Calling Agent Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs">
          {/* Active Free AI Providers Badge */}
          <div className="p-3 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950 rounded-xl border border-emerald-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>100% Free AI Tier Active</span>
              </span>
              <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-emerald-900 text-emerald-300 border border-emerald-700">
                $0.00 / month
              </span>
            </div>
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Speech-to-Text:</span>
                <span className="font-mono text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Groq Whisper
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Agent Brain:</span>
                <span className="font-mono text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Gemini 2.5 Flash
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Voice Synthesis:</span>
                <span className="font-mono text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Edge Neural TTS
                </span>
              </div>
            </div>
          </div>

          {/* Voice Selector */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-violet-400" />
              <span>Agent Speaking Voice (TTS)</span>
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => onSelectVoice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 outline-none"
            >
              {edgeVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Powered by Microsoft Edge Neural TTS (100% free, natural human cadence, zero API key needed).
            </p>
          </div>

          {/* Fish Audio Note */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
            <span className="font-medium text-indigo-300 block mb-1">🐟 Using Fish Audio for Free:</span>
            Fish Audio provides free starter credits on signup at <a href="https://fish.audio" target="_blank" rel="noreferrer" className="text-indigo-400 underline">fish.audio</a>.
            To use it, add <code className="text-slate-300 bg-slate-900 px-1 py-0.5 rounded">FISH_AUDIO_API_KEY</code> and set <code className="text-slate-300 bg-slate-900 px-1 py-0.5 rounded">TTS_PROVIDER=fish-audio</code> in <code className="text-slate-300 bg-slate-900 px-1 py-0.5 rounded">backend/.env</code>. Edge-TTS is always available as a fallback!
          </div>

          {/* Quick Guide */}
          <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl text-slate-400 leading-relaxed text-[11px] flex gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-200">How to Talk:</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400">
                <li>Click <strong>Start Voice Call</strong> to connect.</li>
                <li>Tap <strong>Tap to Speak</strong>, say your message, then click <strong>Click to Send Voice</strong>.</li>
                <li>Or enable <strong>Auto-listen</strong> for hands-free voice turns!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
