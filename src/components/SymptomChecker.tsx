
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import { checkSymptoms } from '../services/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function SymptomChecker() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Assalam-o-Alaikum! I'm SehatGuard AI. I can help identify common health issues in Pakistan like Dengue, Malaria, or Typhoid. How are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await checkSymptoms(newMessages);
      setMessages([...newMessages, { role: 'model', text: response }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'model', text: "I'm having trouble connecting to medical research. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      { role: 'model', text: "Assalam-o-Alaikum! Ready for a new diagnosis. Tell me your symptoms." }
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto h-[650px] flex flex-col frosted-card overflow-hidden relative" id="symptom-checker-root">
      <div className="p-8 pb-4 flex justify-between items-start">
        <div className="mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-1 block">Step 02</span>
          <h2 className="text-3xl font-bold text-teal-950 leading-tight">Symptom Diagnostic</h2>
        </div>
        <button 
          onClick={resetChat}
          className="p-3 hover:bg-teal-100 rounded-full transition-colors text-teal-700"
          title="Reset Chat"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-5 rounded-[2rem] shadow-sm text-sm leading-relaxed max-w-[85%] ${
                msg.role === 'user' 
                ? 'bg-teal-600 text-white rounded-tr-none' 
                : 'bg-white/80 text-teal-900 rounded-tl-none border border-white/60'
              }`}>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/50 backdrop-blur p-4 rounded-2xl rounded-tl-none flex items-center gap-3 border border-white/40">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span className="text-teal-800/60 text-xs font-bold uppercase tracking-widest">Gemini 1.5 Flash Active</span>
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-8 pt-4 border-t border-teal-900/5">
        <form onSubmit={handleSend} className="flex gap-3 bg-white/40 backdrop-blur p-2 rounded-[1.5rem] border border-white/60 focus-within:border-teal-300 transition-all shadow-sm">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type symptoms (e.g. fever, joint pain)..."
            className="flex-1 bg-transparent border-none px-4 py-3 text-sm focus:ring-0 outline-none placeholder:text-teal-900/30 font-medium"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 disabled:bg-teal-300 transition-all shadow-lg shadow-teal-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
