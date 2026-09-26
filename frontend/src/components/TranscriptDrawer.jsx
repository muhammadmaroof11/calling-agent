import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  User,
  Bot,
  Volume2,
  Download,
  Zap,
  MessageSquare,
  Sparkles,
  CornerDownRight
} from 'lucide-react';

export default function TranscriptDrawer({
  isOpen,
  onClose,
  transcript,
  onPlayAudio,
  onQuickPrompt,
}) {
  const scrollRef = useRef(null);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, isOpen]);

  if (!isOpen) return null;

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
    a.download = `voxora_transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#0b0f19]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Call Transcript</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              {transcript.length} {transcript.length === 1 ? 'turn' : 'turns'} recorded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {transcript.length > 0 && (
            <button
              onClick={exportTranscript}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Download Transcript"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-lg">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">No Dialogue Yet</h4>
            <p className="text-slate-400 text-xs max-w-xs mb-5 leading-relaxed">
              Start talking into your mic or select any prompt to see the live transcription:
            </p>

            <div className="flex flex-col gap-2 w-full max-w-xs">
              {[
                'Who are you and what do you do?',
                'Schedule an appointment for tomorrow.',
                'What are your office hours?',
                'Tell me a quick tech joke.',
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onQuickPrompt && onQuickPrompt(prompt)}
                  className="text-left text-xs bg-slate-900/80 hover:bg-indigo-950/60 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 border border-white/10 p-2.5 rounded-xl transition-all flex items-center gap-2"
                >
                  <CornerDownRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
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
                {/* Avatar Icon */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md border ${
                    isUser
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 border-emerald-400/30'
                      : 'bg-gradient-to-tr from-indigo-600 to-violet-600 border-indigo-400/30'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble Card */}
                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-md border ${
                    isUser
                      ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-100 rounded-tr-none'
                      : 'bg-slate-900/90 border-white/10 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">
                      {isUser ? 'Caller' : 'Voxora AI'}
                    </span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {!isUser && msg.audioUrl && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => handlePlayAudio(msg.id, msg.audioUrl)}
                        className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          isPlaying
                            ? 'bg-indigo-600 text-white border-indigo-400'
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
