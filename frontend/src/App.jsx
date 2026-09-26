import React, { useState } from 'react';
import {
  PhoneCall,
  Settings as SettingsIcon,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Activity,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useVoiceCall } from './hooks/useVoiceCall';
import HeroVoiceStage from './components/HeroVoiceStage';
import FloatingIslandDock from './components/FloatingIslandDock';
import TranscriptDrawer from './components/TranscriptDrawer';
import TelemetryDrawer from './components/TelemetryDrawer';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

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

  const lastTranscriptTurn = transcript.length > 0 ? transcript[transcript.length - 1] : null;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[130px] opacity-25 transition-all duration-1000 ${
            agentStatus === 'listening'
              ? 'bg-emerald-500'
              : agentStatus === 'speaking'
              ? 'bg-violet-600'
              : agentStatus === 'thinking' || agentStatus === 'transcribing'
              ? 'bg-amber-500'
              : 'bg-indigo-600'
          }`}
        />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full blur-[120px] bg-purple-900/15" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-[120px] bg-teal-900/10" />
      </div>

      {/* Top Navbar */}
      <header className="border-b border-white/5 bg-[#07090e]/75 backdrop-blur-xl sticky top-0 z-30 px-4 lg:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center text-white border border-white/10 shadow-lg">
                <PhoneCall className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white m-0">Voxora</h1>
                <span className="text-[10px] font-mono font-medium uppercase bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-2 py-0.2 rounded-full">
                  v0.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 m-0 hidden sm:block">
                Ultra-Low Latency Voice Agent • Groq + Gemini + Neural Voice
              </p>
            </div>
          </div>

          {/* Right Header Navigation & Badges */}
          <div className="flex items-center gap-2.5">
            {/* AI Stack Status Pill */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-slate-200">
                Groq Whisper + Gemini 2.5 Flash
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                Free Tier
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

            {/* Transcript Drawer Toggle */}
            <button
              onClick={() => setIsTranscriptOpen(true)}
              className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors shadow-sm"
              title="Open Call Transcript"
            >
              <MessageSquare className="w-4 h-4" />
              {transcript.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full text-[9px] font-mono flex items-center justify-center text-white">
                  {transcript.length}
                </span>
              )}
            </button>

            {/* Telemetry Drawer Toggle */}
            <button
              onClick={() => setIsTelemetryOpen(true)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors shadow-sm"
              title="Open Latency Telemetry"
            >
              <Activity className="w-4 h-4" />
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95 border border-indigo-400/30"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Screen Hero Voice Stage */}
      <main className="flex-1 flex flex-col justify-center items-center z-10 w-full px-4 pb-28 pt-4">
        <HeroVoiceStage
          callState={callState}
          agentStatus={agentStatus}
          callDuration={callDuration}
          isRecording={isRecording}
          errorMessage={errorMessage}
          systemStatus={systemStatus}
          lastTranscriptTurn={lastTranscriptTurn}
          onStartCall={startCall}
          onEndCall={endCall}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onSendTextTurn={sendTextTurn}
          onOpenTranscript={() => setIsTranscriptOpen(true)}
        />
      </main>

      {/* Floating Island Call Dock */}
      <FloatingIslandDock
        callState={callState}
        agentStatus={agentStatus}
        isRecording={isRecording}
        continuousMode={continuousMode}
        transcriptCount={transcript.length}
        onStartCall={startCall}
        onEndCall={endCall}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onToggleContinuous={setContinuousMode}
        onOpenTranscript={() => setIsTranscriptOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Slide-Over Drawers & Modals */}
      <TranscriptDrawer
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
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

      <TelemetryDrawer
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        metrics={lastMetrics}
        systemStatus={systemStatus}
      />

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
