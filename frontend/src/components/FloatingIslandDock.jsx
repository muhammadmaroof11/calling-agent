import React, { useEffect, useState } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MessageSquare,
  Activity,
  Sliders,
  Repeat
} from 'lucide-react';

export default function FloatingIslandDock({
  callState,
  agentStatus,
  isRecording,
  continuousMode,
  transcriptCount,
  onStartCall,
  onEndCall,
  onStartRecording,
  onStopRecording,
  onToggleContinuous,
  onOpenTranscript,
  onOpenTelemetry,
  onOpenSettings,
}) {
  // Global spacebar push to talk
  useEffect(() => {
    if (callState !== 'connected') return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.code === 'Space' && !e.repeat && !isRecording && agentStatus !== 'transcribing' && agentStatus !== 'thinking') {
        e.preventDefault();
        onStartRecording();
      }
    };

    const handleKeyUp = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.code === 'Space' && isRecording) {
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

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-auto px-4 max-w-xl select-none">
      <div className="bg-[#0f1422]/90 backdrop-blur-2xl border border-white/10 p-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-2 sm:gap-3 transition-all">
        {callState === 'connected' ? (
          <>
            {/* Primary Mic / Talk Button */}
            <button
              onClick={isRecording ? onStopRecording : onStartRecording}
              disabled={agentStatus === 'transcribing' || agentStatus === 'thinking'}
              className={`relative group px-5 py-3 rounded-full font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg ${
                isRecording
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-emerald-500/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-white/10 hover:border-emerald-500/50'
              }`}
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'text-white' : 'text-emerald-400'}`} />
              <span>{isRecording ? 'Listening...' : 'Tap to Speak'}</span>
              <span className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-[9px] font-mono bg-black/40 rounded text-slate-400">
                SPACE
              </span>
            </button>

            {/* Hands-Free Auto-Listen Toggle */}
            <button
              onClick={() => onToggleContinuous(!continuousMode)}
              className={`p-3 rounded-full border transition-all ${
                continuousMode
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-emerald-950/50'
                  : 'bg-slate-800/80 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
              title={continuousMode ? 'Auto-listen enabled (hands-free)' : 'Enable auto-listen (hands-free)'}
            >
              <Repeat className={`w-4 h-4 ${continuousMode ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>

            {/* Transcript Drawer Trigger */}
            <button
              onClick={onOpenTranscript}
              className="relative p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white transition-all shadow-sm"
              title="Open Transcript"
            >
              <MessageSquare className="w-4 h-4" />
              {transcriptCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full text-[9px] font-mono flex items-center justify-center text-white border border-[#0f1422]">
                  {transcriptCount}
                </span>
              )}
            </button>

            {/* Telemetry Drawer Trigger */}
            <button
              onClick={onOpenTelemetry}
              className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white transition-all shadow-sm"
              title="Open Telemetry"
            >
              <Activity className="w-4 h-4" />
            </button>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white transition-all shadow-sm"
              title="Voice Studio"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* End Call Button */}
            <button
              onClick={onEndCall}
              className="p-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 border border-rose-400/40 transition-all active:scale-95 ml-1"
              title="End Call"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </>
        ) : (
          /* Start Call Hero Button in Dock */
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={onStartCall}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 border border-emerald-400/30"
            >
              <Phone className="w-4 h-4" />
              <span>Start Voice Call (Free AI)</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white transition-all"
              title="Voice Studio"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
