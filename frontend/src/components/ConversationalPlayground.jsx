import React, { useRef, useEffect, useState } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  Send,
  Volume2,
  Clock,
  User,
  Bot,
  RotateCcw,
  Sparkles,
  Zap,
  Repeat,
  CornerDownRight,
  Download,
  AlertCircle,
  Activity,
  Disc3
} from 'lucide-react';
import ElevenLabsWaveform from './ElevenLabsWaveform';
import VoiceOrb from './VoiceOrb';

export default function ConversationalPlayground({
  callState,
  agentStatus,
  callDuration,
  isRecording,
  continuousMode,
  transcript,
  errorMessage,
  systemStatus,
  selectedVoice,
  onStartCall,
  onEndCall,
  onStartRecording,
  onStopRecording,
  onSendTextTurn,
  onToggleContinuous,
  onPlayAudio,
  onResetSession,
}) {
  const [textInput, setTextInput] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [visualizerMode, setVisualizerMode] = useState('waveform'); // 'waveform' | 'orb'
  const scrollRef = useRef(null);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  // Global Spacebar Push-To-Talk
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

  const handlePlayAudio = (msgId, audioUrl) => {
    setPlayingId(msgId);
    if (onPlayAudio) {
      onPlayAudio(audioUrl);
      setTimeout(() => setPlayingId(null), 3500);
    }
  };

  const exportTranscript = () => {
    if (transcript.length === 0) return;
    const content = transcript
      .map((t) => `[${t.timestamp}] ${t.sender.toUpperCase()}: ${t.text}`)
      .join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voxora_call_transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isConnected = callState === 'connected';

  return (
    <div className="w-full flex flex-col gap-4 text-zinc-100">
      {/* 1. Main ElevenLabs Visualizer & Voice Stage */}
      <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col items-center relative overflow-hidden">
        {/* Top Bar inside Stage */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800/60 z-10">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <span className="text-xs font-bold tracking-tight text-white">
              {isConnected ? 'Live Audio Channel' : 'Voice Agent Offline'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Visualizer Mode Switcher */}
            <div className="flex items-center bg-[#18181f] p-0.5 rounded-lg border border-zinc-800 text-[11px]">
              <button
                onClick={() => setVisualizerMode('waveform')}
                className={`px-2 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  visualizerMode === 'waveform'
                    ? 'bg-[#252530] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Waveform Equalizer"
              >
                <Activity className="w-3 h-3" />
                <span>Wave</span>
              </button>
              <button
                onClick={() => setVisualizerMode('orb')}
                className={`px-2 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  visualizerMode === 'orb'
                    ? 'bg-[#252530] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Fluid Voice Orb"
              >
                <Disc3 className="w-3 h-3" />
                <span>Orb</span>
              </button>
            </div>

            {/* Call Timer */}
            {isConnected && (
              <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-200 bg-[#18181f] px-2.5 py-1 rounded-lg border border-zinc-700/60">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formatDuration(callDuration)}</span>
              </div>
            )}

            {/* Reset Session */}
            {transcript.length > 0 && (
              <button
                onClick={onResetSession}
                className="p-1.5 rounded-lg bg-[#18181f] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                title="Restart Session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="w-full mt-3 p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs z-10 shadow-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Center Visualizer (Waveform or Orb) */}
        <div className="w-full py-4 z-10 flex items-center justify-center min-h-[170px]">
          {visualizerMode === 'waveform' ? (
            <ElevenLabsWaveform status={agentStatus} isConnected={isConnected} />
          ) : (
            <VoiceOrb status={agentStatus} callState={callState} />
          )}
        </div>

        {/* Primary Call Controls */}
        <div className="w-full flex flex-col items-center gap-3 pt-3 border-t border-zinc-800/60 z-10">
          {isConnected ? (
            <div className="flex items-center justify-center gap-3 w-full">
              {/* Mic Action Button */}
              <button
                onClick={isRecording ? onStopRecording : onStartRecording}
                disabled={agentStatus === 'transcribing' || agentStatus === 'thinking'}
                className={`flex-1 max-w-sm py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-md ${
                  isRecording
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 animate-pulse'
                    : 'bg-white hover:bg-zinc-200 text-black shadow-white/5'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? 'Listening... Tap to Send' : 'Tap to Speak'}</span>
                <span className="hidden sm:inline text-[10px] font-mono bg-black/15 text-black px-1.5 py-0.5 rounded ml-1 font-normal">
                  [Space]
                </span>
              </button>

              {/* Hands-Free Toggle */}
              <button
                onClick={() => onToggleContinuous(!continuousMode)}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  continuousMode
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 shadow-sm'
                    : 'bg-[#18181f] text-zinc-400 hover:text-zinc-200 border-zinc-700/80'
                }`}
                title="Hands-free auto listen mode"
              >
                <Repeat className={`w-3.5 h-3.5 ${continuousMode ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span className="hidden sm:inline">Auto-Listen</span>
              </button>

              {/* End Call Button */}
              <button
                onClick={onEndCall}
                className="py-3 px-4 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
                title="End Call"
              >
                <PhoneOff className="w-4 h-4" />
                <span className="hidden sm:inline">End</span>
              </button>
            </div>
          ) : (
            /* Start Voice Call Button */
            <button
              onClick={onStartCall}
              className="py-3 px-8 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-sm shadow-md flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Phone className="w-4 h-4 text-black" />
              <span>Start Voice Call</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Turn-by-Turn Dialogue Stream Card */}
      <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col h-[380px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Dialogue Stream
            </span>
            <span className="text-[10px] font-mono text-zinc-400 bg-[#18181f] border border-zinc-800 px-2 py-0.5 rounded-full">
              {transcript.length} turns
            </span>
          </div>

          {transcript.length > 0 && (
            <button
              onClick={exportTranscript}
              className="p-1.5 rounded-lg bg-[#18181f] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors text-xs flex items-center gap-1"
              title="Download Transcript"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[10px]">Export</span>
            </button>
          )}
        </div>

        {/* Conversation Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {transcript.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-10 h-10 rounded-xl bg-[#18181f] border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
                <Sparkles className="w-4 h-4 text-zinc-300" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Awaiting Audio Dialogue</h4>
              <p className="text-[11px] text-zinc-400 max-w-xs mb-3">
                Click "Start Voice Call" or choose a prompt below to simulate a conversation turn:
              </p>

              {/* Starter Chips */}
              <div className="flex flex-wrap gap-1.5 justify-center max-w-md">
                {[
                  'Who are you?',
                  'Can I schedule a consultation?',
                  'What are your hours of operation?',
                  'How does your AI voice agent work?',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isConnected) {
                        onStartCall().then(() => onSendTextTurn(prompt));
                      } else {
                        onSendTextTurn(prompt);
                      }
                    }}
                    className="text-[11px] bg-[#18181f] hover:bg-[#202029] text-zinc-300 border border-zinc-700/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            transcript.map((msg) => {
              const isUser = msg.sender === 'user';
              const isPlaying = playingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm border ${
                      isUser
                        ? 'bg-zinc-700 border-zinc-600'
                        : 'bg-white text-black border-white'
                    }`}
                  >
                    {isUser ? (
                      <User className="w-3.5 h-3.5 text-zinc-200" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-black" />
                    )}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-xl p-3 text-xs leading-relaxed border ${
                      isUser
                        ? 'bg-zinc-800/90 border-zinc-700/70 text-zinc-100 rounded-tr-none'
                        : 'bg-[#18181f] border-zinc-800 text-zinc-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-zinc-400">
                      <span className="font-semibold text-zinc-300">
                        {isUser ? 'Caller' : 'Voxora Assistant'}
                      </span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {!isUser && msg.audioUrl && (
                      <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between">
                        <button
                          onClick={() => handlePlayAudio(msg.id, msg.audioUrl)}
                          className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                            isPlaying
                              ? 'bg-emerald-500 text-white border-emerald-400'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                          }`}
                        >
                          <Volume2 className={`w-3 h-3 ${isPlaying ? 'animate-bounce' : ''}`} />
                          <span>{isPlaying ? 'Playing...' : 'Replay Audio'}</span>
                        </button>

                        <span className="text-[10px] font-mono text-zinc-500">
                          {selectedVoice.replace('en-US-', '').replace('Neural', '')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 3. Text Simulation Input Bar (Clean, Non-Overlapping Layout) */}
        <form onSubmit={handleTextSubmit} className="mt-3 pt-3 border-t border-zinc-800/80 flex gap-2 w-full">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              isConnected
                ? "Type caller voice message (e.g. 'Can I book a visit?')..."
                : "Type message to simulate turn..."
            }
            className="flex-1 bg-[#18181f] border border-zinc-700/80 focus:border-zinc-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="bg-white hover:bg-zinc-200 disabled:opacity-40 text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
