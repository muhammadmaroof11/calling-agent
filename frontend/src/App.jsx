import React, { useState } from 'react';
import {
  PhoneCall,
  Settings as SettingsIcon,
  RotateCcw,
  Sparkles,
  Layers,
  Headphones,
  CheckCircle2,
  ExternalLink,
  Shield,
  Zap,
  Activity
} from 'lucide-react';
import { useVoiceCall } from './hooks/useVoiceCall';
import CallScreen from './components/CallScreen';
import TranscriptView from './components/TranscriptView';
import PipelineInspector from './components/PipelineInspector';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    callState,
    agentStatus,
    callDuration,
    transcript,
    lastMetrics,
    isRecording,
    continuousMode,
    selectedVoice,
    systemStatus,
    errorMessage,
    setContinuousMode,
    setSelectedVoice,
    startCall,
    endCall,
    startRecording,
    stopRecording,
    sendTextTurn,
    playAgentAudio,
  } = useVoiceCall();

  const handleResetSession = async () => {
    endCall();
    setTimeout(() => {
      startCall();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Top Navbar */}
      <header className="border-b border-white/5 bg-[#0b0f19]/80 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Platform Branding */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center text-white border border-white/10 shadow-lg">
                <PhoneCall className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white m-0">Voxora</h1>
                <span className="text-[10px] font-mono font-semibold uppercase bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full shadow-sm">
                  Agentic Voice v0.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 m-0 hidden sm:block">
                Ultra-Low Latency Calling Agent • Groq Whisper + Gemini Flash + Neural Voice
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Active Free AI Infrastructure Pill */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-white/10 px-3.5 py-1.5 rounded-2xl text-xs text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-slate-200">
                Groq Whisper + Gemini 2.5 Flash
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/80">
                100% Free
              </span>
            </div>

            {/* Restart Session */}
            {callState === 'connected' && (
              <button
                onClick={handleResetSession}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors shadow-sm"
                title="Restart Call Session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Settings & Studio Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white border border-indigo-400/30 text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Voice Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-6">
        {/* Modern Live Telemetry Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-emerald-950/30 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Next-Generation Voice Calling Agent</p>
              <p className="text-slate-400 text-xs">
                Zero paid credits • High-speed Whisper STT • Gemini reasoning • Fish Audio with User's Neural TTS fallback
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-white/5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Turn-Based Realtime Loop</span>
          </div>
        </div>

        {/* 2-Column Split: Call Screen & Live Transcript */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Call Screen & Voice Orb */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col">
            <CallScreen
              callState={callState}
              agentStatus={agentStatus}
              callDuration={callDuration}
              isRecording={isRecording}
              continuousMode={continuousMode}
              errorMessage={errorMessage}
              systemStatus={systemStatus}
              onStartCall={startCall}
              onEndCall={endCall}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onSendTextTurn={sendTextTurn}
              onToggleContinuous={setContinuousMode}
            />
          </div>

          {/* Right Column: Live Transcript Dialogue */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col">
            <TranscriptView
              transcript={transcript}
              onPlayAudio={playAgentAudio}
              onQuickPrompt={(prompt) => {
                if (callState !== 'connected') {
                  startCall().then(() => sendTextTurn(prompt));
                } else {
                  sendTextTurn(prompt);
                }
              }}
            />
          </div>
        </div>

        {/* Full Width Bottom: Educational Telemetry Inspector */}
        <div className="w-full">
          <PipelineInspector
            metrics={lastMetrics}
            agentStatus={agentStatus}
            systemStatus={systemStatus}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#07090e]/80 py-5 px-6 text-center text-xs text-slate-500">
        Voxora Calling Agent • Built with FastAPI, Groq Whisper, Google Gemini, Fish Audio, Edge Neural TTS, and React
      </footer>

      {/* Settings & Voice Studio Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoice}
        systemStatus={systemStatus}
      />
    </div>
  );
}
