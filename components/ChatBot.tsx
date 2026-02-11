
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hujambo. Mimi ni KaziTrust AI, your dedicated legal counselor. How may I assist you with your employment situation today? Our session is secure and grounded in the Employment Act 2007." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      const reply = await geminiService.chatWithWorker(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', content: reply || 'I apologize, an unexpected processing error occurred.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: 'Pole sana, the connection to the legal database was interrupted. Please try again shortly.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col civic-card overflow-hidden">
      <div className="bg-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-2xl shadow-inner">🛡️</div>
          <div>
            <h3 className="font-extrabold text-white text-lg tracking-tight">KaziTrust AI</h3>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Active Legal Session</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-500">
           <div className="text-right">
             <p className="text-[10px] font-bold uppercase tracking-widest">Security Status</p>
             <p className="text-xs text-slate-400 font-medium">Encrypted & Grounded</p>
           </div>
           <div className="w-px h-8 bg-slate-800"></div>
           <span className="text-2xl">🔒</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-950/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-6 rounded-2xl text-[16px] leading-relaxed shadow-lg ${
              msg.role === 'user' 
                ? 'bg-emerald-700 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question in English, Swahili, or Sheng..."
          className="flex-1 bg-slate-950 border border-slate-800 px-6 py-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700 text-[16px]"
        />
        <button
          disabled={loading || !input.trim()}
          className="bg-emerald-600 text-white px-8 py-4 rounded-xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50 active:scale-95 flex items-center justify-center"
        >
          <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
