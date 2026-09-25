import React, { useState } from 'react';
import {
  PhoneCall,
  Settings as SettingsIcon,
  RotateCcw,
  Sparkles,
  Layers,
  Headphones,
  CheckCircle2
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
    startCall();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white m-0">Voxora</h1>
                <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">
                  v0.1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 m-0">Voice Calling Agent • Whisper + FastAPI + React</p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Engine Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-full text-xs text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  systemStatus?.openai_configured ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="font-medium">
                {systemStatus?.openai_configured ? 'OpenAI Whisper & GPT' : 'Offline Smart Demo'}
              </span>
            </div>

            {/* Restart Session */}
            {callState === 'connected' && (
              <button
                onClick={handleResetSession}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Restart Call Session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-6">
        {/* Intro Banner for Beginners */}
        <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/40 border border-indigo-900/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Welcome to Voxora!</p>
              <p className="text-slate-400">
                Experience the foundational 3-stage loop of an AI voice calling agent: Listen (STT) → Think (LLM) → Speak (TTS).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Plug &amp; play: test via mic or text simulation</span>
          </div>
        </div>

        {/* 2-Column Core Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Call Interface */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col">
            <CallScreen
              callState={callState}
              agentStatus={agentStatus}
              callDuration={callDuration}
              isRecording={isRecording}
              continuousMode={continuousMode}
              errorMessage={errorMessage}
              onStartCall={startCall}
              onEndCall={endCall}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onSendTextTurn={sendTextTurn}
              onToggleContinuous={setContinuousMode}
            />
          </div>

          {/* Right Column: Live Transcript */}
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

        {/* Pipeline Inspector: Educational Metrics & Flow */}
        <div className="w-full">
          <PipelineInspector
            metrics={lastMetrics}
            agentStatus={agentStatus}
            systemStatus={systemStatus}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
        Voxora Calling Agent • Built with FastAPI, OpenAI Whisper, Edge Neural TTS, and React
      </footer>

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
