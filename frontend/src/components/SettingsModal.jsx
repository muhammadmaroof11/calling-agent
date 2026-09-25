import React from 'react';
import { X, Key, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';

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
        <div className="py-4 space-y-5 text-xs">
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
              Powered by Edge Neural TTS (Free, realistic human cadence, no API key needed).
            </p>
          </div>

          {/* OpenAI Integration Status */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" />
                <span>OpenAI Whisper &amp; GPT Status</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                  systemStatus?.openai_configured
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {systemStatus?.openai_configured ? 'Active (API Key Set)' : 'Offline Demo Mode'}
              </span>
            </div>

            {systemStatus?.openai_configured ? (
              <p className="text-slate-400 leading-relaxed text-[11px]">
                OpenAI Whisper is transcribing your microphone audio and {systemStatus.llm_model} is handling conversation turns.
              </p>
            ) : (
              <p className="text-slate-400 leading-relaxed text-[11px]">
                To activate real OpenAI Whisper transcription and GPT-4o-mini, open <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">backend/.env</code> and set your <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">OPENAI_API_KEY</code>.
              </p>
            )}
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
