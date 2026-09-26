import React, { useState } from 'react';
import {
  PhoneCall,
  RotateCcw,
  Sliders,
  ExternalLink,
  Bot,
  Zap
} from 'lucide-react';
import { useVoiceCall } from './hooks/useVoiceCall';
import AgentConfigPanel from './components/AgentConfigPanel';
import ConversationalPlayground from './components/ConversationalPlayground';
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

  const handleResetSession = () => {
    endCall();
    setTimeout(() => {
      startCall();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Top ElevenLabs-Style Header Bar */}
      <header className="border-b border-zinc-800/80 bg-[#0d0d11] sticky top-0 z-40 px-4 lg:px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Agent Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black font-extrabold shadow-sm">
              <PhoneCall className="w-3.5 h-3.5 text-black" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white">Voxora</span>
              <span className="text-zinc-600 font-mono">/</span>
              <span className="text-[11px] font-medium text-zinc-400">Conversational AI Agent</span>
            </div>
          </div>

          {/* Right Controls & Telemetry Badge */}
          <div className="flex items-center gap-2.5">
            {/* Live Model Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-[#141418] border border-zinc-800 px-2.5 py-0.5 rounded-full text-[11px] text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-zinc-200">Groq Whisper + Gemini Flash</span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/80">
                Free Stack
              </span>
            </div>

            {/* Voice Studio / Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#18181f] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 text-[11px] font-semibold transition-all active:scale-95"
            >
              <Sliders className="w-3 h-3" />
              <span>Studio Config</span>
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/muhammadmaroof11/calling-agent"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-[#18181f] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main SaaS Studio Container (Shorter Padding & Gap) */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 lg:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Agent Configuration & Latency Telemetry (5 cols) */}
          <div className="lg:col-span-5">
            <AgentConfigPanel
              selectedVoice={selectedVoice}
              onSelectVoice={setSelectedVoice}
              systemStatus={systemStatus}
              lastMetrics={lastMetrics}
              transcriptCount={transcript.length}
            />
          </div>

          {/* Right Column: Conversational Calling Stage & Live Feed (7 cols) */}
          <div className="lg:col-span-7">
            <ConversationalPlayground
              callState={callState}
              agentStatus={agentStatus}
              callDuration={callDuration}
              isRecording={isRecording}
              continuousMode={continuousMode}
              transcript={transcript}
              errorMessage={errorMessage}
              systemStatus={systemStatus}
              selectedVoice={selectedVoice}
              onStartCall={startCall}
              onEndCall={endCall}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onSendTextTurn={sendTextTurn}
              onToggleContinuous={setContinuousMode}
              onPlayAudio={playAgentAudio}
              onResetSession={handleResetSession}
            />
          </div>
        </div>
      </main>

      {/* Settings Modal */}
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
