import React, { useState } from 'react';
import { Phone, PhoneOff, Mic, Sparkles, Send, Radio, Clock, AlertCircle, CornerDownRight } from 'lucide-react';
import VoiceOrb from './VoiceOrb';

export default function HeroVoiceStage({
  callState,
  agentStatus,
  callDuration,
  isRecording,
  errorMessage,
  systemStatus,
  lastTranscriptTurn,
  onStartCall,
  onEndCall,
  onStartRecording,
  onStopRecording,
  onSendTextTurn,
  onOpenTranscript,
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
    if (callState === 'idle') {
      return {
        badge: 'Offline',
        badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
        title: 'Voice Calling Agent',
        subtitle: 'Tap "Start Voice Call" to experience ultra-fast free voice calling.',
      };
    }
    if (callState === 'ended') {
      return {
        badge: 'Ended',
        badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800',
        title: 'Call Disconnected',
        subtitle: 'Session finished. Tap below to reconnect or view transcript.',
      };
    }

    switch (agentStatus) {
      case 'listening':
        return {
          badge: 'Listening',
          badgeColor: 'bg-emerald-950/90 text-emerald-300 border-emerald-700 animate-pulse',
          title: 'Listening to You...',
          subtitle: 'Speak into your microphone. Tap again or release [Space] to send.',
        };
      case 'transcribing':
        return {
          badge: 'Whisper STT',
          badgeColor: 'bg-amber-950/90 text-amber-300 border-amber-700 animate-pulse',
          title: 'Groq Whisper Transcribing...',
          subtitle: 'Converting raw voice audio to text tokens in ~150ms.',
        };
      case 'thinking':
        return {
          badge: 'Gemini Brain',
          badgeColor: 'bg-blue-950/90 text-blue-300 border-blue-700 animate-pulse',
          title: 'Gemini 2.5 Flash Reasoning...',
          subtitle: 'Formatting a natural conversational telephone response.',
        };
      case 'speaking':
        return {
          badge: 'Neural Voice',
          badgeColor: 'bg-violet-950/90 text-violet-300 border-violet-700 animate-pulse',
          title: 'Voxora Speaking...',
          subtitle: 'Streaming natural speech audio with fallback resilience.',
        };
      default:
        return {
          badge: 'Live Call',
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
          title: 'In Call with Voxora',
          subtitle: 'Tap the mic or hold [Space] to speak naturally.',
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[620px] p-6 select-none">
      {/* Top Ambient Call Header */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <span className={`px-3 py-1 rounded-full text-xs font-mono border ${status.badgeColor} shadow-sm`}>
            {status.badge}
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {systemStatus?.llm_provider || 'Gemini 2.5 Flash'}
          </span>
        </div>

        {callState === 'connected' && (
          <div className="flex items-center gap-2 bg-slate-900/90 border border-white/10 px-3.5 py-1 rounded-full text-xs font-mono text-slate-200 shadow-md">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{formatDuration(callDuration)}</span>
          </div>
        )}
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="w-full max-w-lg my-3 p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-2xl flex items-center gap-3 text-rose-300 text-xs z-10 shadow-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      {/* Hero Visualizer Center */}
      <div className="my-auto flex flex-col items-center justify-center text-center z-10 py-6">
        {/* Dynamic Luminous Voice Orb & 60fps Wave */}
        <VoiceOrb status={agentStatus} callState={callState} />

        {/* Dynamic Status Typography */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
          {status.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1.5 leading-relaxed font-normal">
          {status.subtitle}
        </p>

        {/* Live Conversation Subtitle / Last Turn Bubble Preview */}
        {callState === 'connected' && lastTranscriptTurn && (
          <div
            onClick={onOpenTranscript}
            className="mt-4 px-4 py-2 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 max-w-lg cursor-pointer transition-all shadow-md group"
          >
            <p className="text-xs text-slate-300 truncate">
              <span className="font-semibold text-indigo-300 mr-1.5">
                {lastTranscriptTurn.sender === 'user' ? 'Caller:' : 'Voxora:'}
              </span>
              "{lastTranscriptTurn.text}"
            </p>
          </div>
        )}
      </div>

      {/* Bottom Floating Quick Prompts & Simulation Bar */}
      <div className="w-full max-w-xl flex flex-col items-center gap-3 z-10">
        {/* Starter Chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            'Who are you?',
            'Schedule appointment',
            'Office hours',
            'Tell a joke',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (callState !== 'connected') {
                  onStartCall().then(() => onSendTextTurn(prompt));
                } else {
                  onSendTextTurn(prompt);
                }
              }}
              className="text-[11px] bg-slate-900/80 hover:bg-indigo-950/80 hover:border-indigo-500/50 text-slate-300 hover:text-white border border-white/10 px-3 py-1.5 rounded-full transition-all shadow-sm active:scale-95 flex items-center gap-1"
            >
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Minimal Text Simulation Bar */}
        <form onSubmit={handleTextSubmit} className="flex gap-2 w-full">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              callState === 'connected'
                ? "Simulate caller voice (type & Enter)..."
                : "Type message to simulate turn..."
            }
            className="flex-1 bg-slate-950/70 border border-white/10 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all shadow-inner focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
