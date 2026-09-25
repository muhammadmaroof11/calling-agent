import React, { useRef, useEffect, useState } from 'react';
import {
  User,
  Bot,
  Volume2,
  MessageSquare,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  CornerDownRight
} from 'lucide-react';

export default function TranscriptView({ transcript, onPlayAudio, onQuickPrompt }) {
  const scrollRef = useRef(null);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const handlePlayAudio = (msgId, audioUrl) => {
    setPlayingId(msgId);
    if (onPlayAudio) {
      onPlayAudio(audioUrl);
      setTimeout(() => setPlayingId(null), 3000);
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

  return (
    <div className="glass-card rounded-3xl p-6 shadow-2xl flex flex-col h-[580px] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Live Call Transcript</h3>
            <p className="text-[11px] text-slate-400">Synchronized speech-to-text dialogue feed</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 bg-slate-800/80 border border-white/5 px-2.5 py-1 rounded-full font-mono">
            {transcript.length} {transcript.length === 1 ? 'turn' : 'turns'}
          </span>
          {transcript.length > 0 && (
            <button
              onClick={exportTranscript}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/5 transition-colors"
              title="Export Transcript (.txt)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-950 to-slate-900 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-lg shadow-indigo-950/40">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">Awaiting Call Audio</h4>
            <p className="text-slate-400 text-xs max-w-xs mb-5 leading-relaxed">
              Connect the voice call and speak, or tap any starter prompt below to test conversational response:
            </p>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {[
                'Who are you and what can you do?',
                'I would like to schedule an appointment.',
                'What are your working hours?',
                'Tell me a quick developer joke.',
                'Explain how your voice pipeline works.',
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onQuickPrompt && onQuickPrompt(prompt)}
                  className="text-[11px] bg-slate-900/80 hover:bg-indigo-950/60 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 border border-white/10 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <CornerDownRight className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                  <span>"{prompt}"</span>
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
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Speaker Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md border ${
                    isUser
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 border-emerald-400/30'
                      : 'bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 border-indigo-400/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble Card */}
                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md border transition-all ${
                    isUser
                      ? 'bg-emerald-950/50 border-emerald-600/30 text-emerald-100 rounded-tr-none'
                      : 'bg-slate-900/90 border-white/10 text-slate-200 rounded-tl-none hover:border-white/20'
                  }`}
                >
                  {/* Bubble Top Meta */}
                  <div className="flex items-center justify-between gap-3 mb-1.5 text-[10px]">
                    <span className="font-semibold text-slate-300">
                      {isUser ? 'Caller' : 'Voxora AI'}
                    </span>
                    <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Message Content */}
                  <p className="whitespace-pre-wrap text-slate-100 font-normal leading-normal">
                    {msg.text}
                  </p>

                  {/* Audio Controls for Agent */}
                  {!isUser && msg.audioUrl && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => handlePlayAudio(msg.id, msg.audioUrl)}
                        className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          isPlaying
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border-indigo-900/40'
                        }`}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce' : ''}`} />
                        <span>{isPlaying ? 'Playing...' : 'Replay Voice'}</span>
                      </button>

                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Voice Turn</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
