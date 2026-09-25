import React, { useRef, useEffect } from 'react';
import { User, Bot, Volume2, MessageSquare } from 'lucide-react';

export default function TranscriptView({ transcript, onPlayAudio, onQuickPrompt }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[480px]">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-white text-base">Live Call Transcript</h3>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
          {transcript.length} turns
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3 border border-slate-700/50">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-slate-300 font-medium text-sm mb-1">Call has not started yet</h4>
            <p className="text-slate-500 text-xs max-w-xs mb-4">
              Press "Start Call" or use one of the quick test prompts below to simulate caller speech.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-xs">
              {[
                'Hello Voxora, who are you?',
                'Can I book an appointment?',
                'What are your office hours?',
                'Tell me a quick joke',
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onQuickPrompt && onQuickPrompt(prompt)}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          transcript.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow ${
                    isUser
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                      : 'bg-gradient-to-tr from-indigo-600 to-violet-500'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-emerald-600/90 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-75">
                    <span className="font-semibold">{isUser ? 'Caller' : 'Voxora'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Audio Replay for Agent messages */}
                  {!isUser && msg.audioUrl && (
                    <button
                      onClick={() => onPlayAudio && onPlayAudio(msg.audioUrl)}
                      className="mt-2 flex items-center gap-1.5 text-[11px] text-indigo-300 hover:text-indigo-200 bg-slate-900/60 hover:bg-slate-900 border border-indigo-900/40 px-2 py-1 rounded-md transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Replay Voice
                    </button>
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
