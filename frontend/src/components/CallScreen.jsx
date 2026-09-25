import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Sparkles,
  Send,
  Radio,
  Clock,
  AlertCircle,
  Volume2,
  Zap,
  Repeat
} from 'lucide-react';
import VoiceOrb from './VoiceOrb';

export default function CallScreen({
  callState,
  agentStatus,
  callDuration,
  isRecording,
  continuousMode,
  errorMessage,
  systemStatus,
  onStartCall,
  onEndCall,
  onStartRecording,
  onStopRecording,
  onSendTextTurn,
  onToggleContinuous,
}) {
  const [textInput, setTextInput] = useState('');

  // Keyboard shortcut: Spacebar to toggle speak during connected call
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space' && callState === 'connected') {
        e.preventDefault();
        if (!isRecording && agentStatus !== 'transcribing' && agentStatus !== 'thinking') {
          onStartRecording();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space' && callState === 'connected' && isRecording) {
        e.preventDefault();
        onStopRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [callState, isRecording, agentStatus, onStartRecording, onStopRecording]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      onSendTextTurn(textInput.trim());
      setTextInput('');
    }
  };

  const getStatusDisplay = () => {
    if (callState === 'idle') {
      return {
        title: 'Ready to Connect',
        desc: 'Start voice call with Voxora to experience the sub-second free AI voice loop.',
        badge: 'Offline',
        badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
      };
    }
    if (callState === 'ended') {
      return {
        title: 'Call Disconnected',
        desc: 'Session ended. Review transcript on the right or tap to reconnect.',
        badge: 'Ended',
        badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800',
      };
    }

    switch (agentStatus) {
      case 'listening':
        return {
          title: 'Listening to Caller...',
          desc: 'Speak naturally into your microphone. Tap again or release to send.',
          badge: 'Mic Active',
          badgeColor: 'bg-emerald-950/90 text-emerald-300 border-emerald-700 animate-pulse',
        };
      case 'transcribing':
        return {
          title: 'Groq Whisper Transcribing...',
          desc: 'Converting audio waveform to text tokens in ~150ms.',
          badge: 'STT Active',
          badgeColor: 'bg-amber-950/90 text-amber-300 border-amber-700 animate-pulse',
        };
      case 'thinking':
        return {
          title: 'Gemini 2.5 Flash Reasoning...',
          desc: 'Generating conversational telephone response with session context.',
          badge: 'Brain Active',
          badgeColor: 'bg-blue-950/90 text-blue-300 border-blue-700 animate-pulse',
        };
      case 'speaking':
        return {
          title: 'Voxora Speaking...',
          desc: 'Synthesizing voice audio stream via Fish Audio & User Neural TTS.',
          badge: 'TTS Active',
          badgeColor: 'bg-violet-950/90 text-violet-300 border-violet-700 animate-pulse',
        };
      default:
        return {
          title: 'Call Connected',
          desc: 'Tap the mic or hold [Space] to speak with Voxora.',
          badge: 'Connected',
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="glass-card rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[580px] relative overflow-hidden border border-white/10">
      {/* Top Header Information */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-white/5 z-10">
        <div className="flex items-center gap-2.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono border ${status.badgeColor}`}>
            {status.badge}
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {systemStatus?.llm_provider || 'Gemini 2.5 Flash'}
          </span>
        </div>

        {callState === 'connected' && (
          <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-slate-200">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{formatDuration(callDuration)}</span>
          </div>
        )}
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="w-full my-2 p-3 bg-rose-950/60 border border-rose-800/80 rounded-2xl flex items-center gap-2.5 text-rose-300 text-xs z-10 shadow-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      {/* Central Visualizer Section */}
      <div className="my-auto flex flex-col items-center justify-center text-center z-10 py-4">
        {/* Dynamic Voice Orb */}
        <VoiceOrb status={agentStatus} callState={callState} />

        {/* Dynamic Status Title & Subtitle */}
        <h3 className="text-xl font-bold tracking-tight text-white mt-1">
          {status.title}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
          {status.desc}
        </p>
      </div>

      {/* Action Controls & Dock */}
      <div className="w-full flex flex-col gap-3.5 z-10 pt-2">
        {callState === 'connected' ? (
          <>
            {/* Primary Calling Dock */}
            <div className="flex items-center justify-center gap-3">
              {/* Main Mic Button */}
              <button
                onClick={isRecording ? onStopRecording : onStartRecording}
                disabled={agentStatus === 'transcribing' || agentStatus === 'thinking'}
                className={`relative group px-6 py-4 rounded-2xl font-semibold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 ${
                  isRecording
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-emerald-500/30 scale-105'
                    : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-white/10 hover:border-emerald-500/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isRecording ? 'bg-white/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <Mic className="w-4 h-4" />
                </div>
                <span>{isRecording ? 'Listening... Tap to Send' : 'Tap to Speak'}</span>
                <span className="hidden md:inline text-[10px] text-slate-400 font-mono bg-black/30 px-1.5 py-0.5 rounded ml-1">
                  Hold [Space]
                </span>
              </button>

              {/* End Call Button */}
              <button
                onClick={onEndCall}
                className="p-4 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/25 border border-rose-500/40 transition-transform active:scale-95"
                title="Disconnect Call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>

            {/* Hands-Free Mode Toggle */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-900/60 border border-white/5 hover:border-white/10 px-3 py-1.5 rounded-xl transition-colors">
                <input
                  type="checkbox"
                  checked={continuousMode}
                  onChange={(e) => onToggleContinuous(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <Repeat className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] text-slate-300">Continuous conversation (Auto-listen)</span>
              </label>
            </div>
          </>
        ) : (
          /* Start Voice Call Hero Button */
          <div className="flex justify-center">
            <button
              onClick={onStartCall}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-sm shadow-2xl shadow-emerald-500/30 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 active:scale-95 border border-emerald-400/20"
            >
              <Phone className="w-5 h-5" />
              <span>Connect Voice Call (Free AI)</span>
            </button>
          </div>
        )}

        {/* Text Simulation Input Bar */}
        <form onSubmit={handleTextSubmit} className="flex gap-2 w-full mt-1">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              callState === 'connected'
                ? "Simulate caller speech (e.g., 'What are your hours?')..."
                : "Type message to simulate turn..."
            }
            className="flex-1 bg-slate-950/70 border border-white/10 focus:border-indigo-500/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
