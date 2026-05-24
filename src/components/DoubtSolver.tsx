import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Bot, User, Sparkles, Lightbulb, BookOpen, GraduationCap, Trash2, Mic, Zap } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { solveDoubt, isAPIConfigured } from '../services/geminiAI';

export default function DoubtSolver() {
  const { theme, doubtHistory, addDoubtMessage, clearDoubtHistory } = useApp();
  const isDark = theme === 'dark';
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [explanationType, setExplanationType] = useState('simple');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [doubtHistory, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userQuestion = input;
    const userMsg = {
      id: String(Date.now()),
      role: 'user' as const,
      content: userQuestion,
      timestamp: new Date().toISOString(),
    };
    addDoubtMessage(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      // Call real AI
      const response = await solveDoubt(userQuestion, explanationType);
      
      const aiMsg = {
        id: String(Date.now() + 1),
        role: 'ai' as const,
        content: response,
        timestamp: new Date().toISOString(),
        type: explanationType,
      };
      addDoubtMessage(aiMsg);
    } catch (error) {
      const errorMsg = {
        id: String(Date.now() + 1),
        role: 'ai' as const,
        content: '❌ Sorry, I encountered an error. Please try again!',
        timestamp: new Date().toISOString(),
      };
      addDoubtMessage(errorMsg);
    }
    setIsTyping(false);
  };
  
  const aiConnected = isAPIConfigured();

  const quickQuestions = [
    "Explain quadratic equations",
    "What is photosynthesis?",
    "How does electricity work?",
    "What is Newton's first law?",
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className={`${isDark ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'} border rounded-2xl p-6 mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/25">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display flex items-center gap-2">
                AI Doubt Solver
                {aiConnected ? (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                    <Zap className="h-3 w-3" /> Gemini AI
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">
                    Demo Mode
                  </span>
                )}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Ask any doubt, get instant explanations</p>
            </div>
          </div>
          {doubtHistory.length > 0 && (
            <button onClick={clearDoubtHistory} className={`p-2 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} rounded-lg transition cursor-pointer`}>
              <Trash2 className="h-5 w-5 text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Explanation Type */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: 'simple', label: 'Simple', icon: Lightbulb },
          { id: 'detailed', label: 'Detailed', icon: BookOpen },
          { id: 'example', label: 'With Example', icon: Sparkles },
          { id: 'exam', label: 'Exam-Oriented', icon: GraduationCap },
        ].map(type => (
          <button key={type.id} onClick={() => setExplanationType(type.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer flex items-center gap-2 ${
              explanationType === type.id 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                : `${isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
            }`}>
            <type.icon className="h-4 w-4" /> {type.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div ref={chatRef} className={`flex-1 ${isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-4 overflow-y-auto chat-scroll`}>
        {doubtHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/30 mb-4">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">How can I help you learn?</h3>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} text-center mb-6`}>
              Ask me any doubt about your subjects.<br/>I'll explain it step by step!
            </p>
            
            {/* Quick Questions */}
            <div className="flex flex-wrap justify-center gap-2">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => setInput(q)}
                  className={`px-4 py-2 ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-full text-sm transition cursor-pointer`}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {doubtHistory.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? `${isDark ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-indigo-100 border-indigo-200'} border rounded-tr-none` 
                    : `${isDark ? 'bg-white/[0.05] border-white/[0.08]' : 'bg-white border-gray-200'} border rounded-tl-none`
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-[10px] mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className={`p-4 ${isDark ? 'bg-white/[0.05]' : 'bg-white'} rounded-2xl rounded-tl-none`}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`mt-4 p-2 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'} border rounded-2xl flex items-center gap-2`}>
        <button className={`p-3 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} rounded-xl transition cursor-pointer`}>
          <Mic className="h-5 w-5 text-emerald-500" />
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your doubt here..."
          className={`flex-1 px-4 py-3 ${isDark ? 'bg-transparent text-white placeholder-gray-500' : 'bg-transparent text-gray-900 placeholder-gray-400'} focus:outline-none`}
        />
        <button onClick={sendMessage} disabled={!input.trim()}
          className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white hover:from-emerald-400 hover:to-teal-400 transition cursor-pointer disabled:opacity-50">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
