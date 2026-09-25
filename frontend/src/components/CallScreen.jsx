import React, { useState } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Sparkles,
  Send,
  Radio,
  Clock,
  AlertCircle
} from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

export default function CallScreen({
  callState,
  agentStatus,
  callDuration,
  isRecording,
  continuousMode,
  errorMessage,
  onStartCall,
  onEndCall,
  onStartRecording,
  onStopRecording,
  onSendTextTurn,
  onToggleContinuous,
}) {
  const [textInput, setTextInput] = useState('');

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
    if (callState === 'idle') return { label: 'Ready to Call', color: 'text-slate-400' };
    if (callState === 'ended') return { label: 'Call Ended', color: 'text-rose-400' };
    
    switch (agentStatus) {
      case 'listening':
        return { label: 'Listening to you... (Click Mic to Send)', color: 'text-emerald-400' };
      case 'transcribing':
        return { label: 'Transcribing Audio (Whisper STT)...', color: 'text-amber-400' };
      case 'thinking':
        return { label: 'Agent Thinking (LLM Brain)...', color: 'text-blue-400' };
      case 'speaking':
        return { label: 'Voxora Speaking (Neural TTS)...', color: 'text-fuchsia-400' };
      default:
        return { label: 'In Call • Tap Mic to Speak', color: 'text-teal-300' };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between min-h-[480px] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div
        className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          agentStatus === 'listening'
            ? 'bg-emerald-500/20'
            : agentStatus === 'speaking'
            ? 'bg-violet-600/20'
            : agentStatus === 'thinking' || agentStatus === 'transcribing'
            ? 'bg-amber-500/20'
            : 'bg-indigo-600/10'
        }`}
      />

      {/* Top Bar: Call Timer & Status */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              callState === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'
            }`}
          />
          <span className="text-xs font-medium text-slate-300">
            {callState === 'connected' ? 'Live Call' : 'Offline'}
          </span>
        </div>

        {callState === 'connected' && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDuration(callDuration)}</span>
          </div>
        )}
      </div>

      {/* Error message notification if any */}
      {errorMessage && (
        <div className="w-full mt-3 p-2.5 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-center gap-2 text-rose-300 text-xs z-10">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      {/* Center Phone Call Avatar & Waveform */}
      <div className="my-auto flex flex-col items-center z-10 py-6">
        <div className="relative flex items-center justify-center">
          {/* Animated concentric rings */}
          {callState === 'connected' && (
            <>
              <div
                className={`absolute w-44 h-44 rounded-full border border-current opacity-20 animate-ping pointer-events-none ${
                  agentStatus === 'speaking'
                    ? 'text-violet-500'
                    : agentStatus === 'listening'
                    ? 'text-emerald-500'
                    : 'text-slate-600'
                }`}
                style={{ animationDuration: '3s' }}
              />
              <div
                className={`absolute w-36 h-36 rounded-full border border-current opacity-30 pointer-events-none ${
                  agentStatus === 'speaking'
                    ? 'text-fuchsia-400 animate-pulse'
                    : agentStatus === 'listening'
                    ? 'text-teal-400 animate-pulse'
                    : 'text-slate-700'
                }`}
              />
            </>
          )}

          {/* Central Sphere / Avatar */}
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
              callState === 'connected'
                ? agentStatus === 'speaking'
                  ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-violet-500/40 scale-105'
                  : agentStatus === 'listening'
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/40 scale-105'
                  : agentStatus === 'thinking' || agentStatus === 'transcribing'
                  ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/40'
                  : 'bg-gradient-to-tr from-indigo-700 to-blue-600 shadow-indigo-600/30'
                : 'bg-slate-800 border-2 border-slate-700 text-slate-500'
            }`}
          >
            {callState === 'connected' ? (
              agentStatus === 'listening' ? (
                <Mic className="w-10 h-10 text-white animate-bounce" />
              ) : agentStatus === 'speaking' ? (
                <Radio className="w-10 h-10 text-white animate-pulse" />
              ) : (
                <Sparkles className="w-10 h-10 text-white" />
              )
            ) : (
              <Phone className="w-10 h-10 text-slate-400" />
            )}
          </div>
        </div>

        {/* Audio Waveform */}
        <div className="w-full max-w-xs mt-4">
          <AudioVisualizer status={agentStatus} />
        </div>

        {/* Status Text */}
        <h4 className={`text-sm font-semibold tracking-wide mt-1 ${statusInfo.color} transition-colors`}>
          {statusInfo.label}
        </h4>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {callState === 'connected' ? 'Voxora Voice Assistant' : 'Click "Start Call" to begin'}
        </p>
      </div>

      {/* Controls & Interaction */}
      <div className="w-full flex flex-col gap-3 z-10">
        {callState === 'connected' ? (
          <>
            {/* Primary Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              {/* Mic Toggle Button */}
              <button
                onClick={isRecording ? onStopRecording : onStartRecording}
                disabled={agentStatus === 'transcribing' || agentStatus === 'thinking'}
                className={`relative group px-5 py-3.5 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 ${
                  isRecording
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isRecording ? (
                  <>
                    <Mic className="w-4 h-4 text-white" />
                    <span>Click to Send Voice</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>Tap to Speak</span>
                  </>
                )}
              </button>

              {/* End Call Button */}
              <button
                onClick={onEndCall}
                className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>

            {/* Hands-free mode toggle */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={continuousMode}
                  onChange={(e) => onToggleContinuous(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>Auto-listen (hands-free conversational mode)</span>
              </label>
            </div>
          </>
        ) : (
          /* Start Call Button */
          <div className="flex justify-center">
            <button
              onClick={onStartCall}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Phone className="w-5 h-5" />
              <span>Start Voice Call</span>
            </button>
          </div>
        )}

        {/* Fallback Text Simulation Bar */}
        <form onSubmit={handleTextSubmit} className="flex gap-2 w-full mt-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              callState === 'connected'
                ? "Or type what caller says (e.g. 'Can I book a visit?')..."
                : "Type message to simulate call turn..."
            }
            className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
