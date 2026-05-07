import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, SCENARIOS } from './store/useChatStore';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { ScenarioSelector } from './components/ScenarioSelector';
import { Sparkles, Trash2, GraduationCap, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ChatViewProps {
  onBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onBack }) => {
  const { messages, addMessage, isTyping, setTyping, clearHistory, activeScenarioId } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Initial welcome message if history is empty
  useEffect(() => {
    if (messages.length === 0 && activeScenario) {
      addMessage({
        role: 'assistant',
        content: activeScenario.initialMessage
      });
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    // 1. Add user message
    addMessage({
      role: 'user',
      content: text
    });

    // 2. Simulate AI response
    setTyping(true);
    
    // Simulating network delay
    setTimeout(() => {
      setTyping(false);
      
      const response = getMockAIResponse(text, activeScenarioId);
      addMessage({
        role: 'assistant',
        content: response
      });
      
      // Success feedback
      toast.success('AI responded', { duration: 1000 });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 z-20 glass-card px-4 py-4 md:px-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">AI Teacher</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Online & Learning</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            if(confirm('Clear all chat history?')) clearHistory();
          }}
          className="p-2.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-xl transition-all"
          title="Clear History"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Sidebar: Scenarios (Desktop only or Drawer on Mobile) */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 p-6 bg-slate-950/50">
          <div className="flex items-center gap-2 mb-6 text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Senaryolar</span>
          </div>
          <div className="space-y-4">
            {SCENARIOS.map(s => (
              <button
                key={s.id}
                onClick={() => useChatStore.getState().setScenario(s.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  activeScenarioId === s.id 
                    ? 'bg-indigo-600/10 border-indigo-500/50 text-white' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl">{s.icon}</span>
                  <span className="font-bold text-sm">{s.name}</span>
                </div>
                <p className="text-[10px] opacity-60 leading-tight">{s.description}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Main Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20">
          {/* Mobile Scenario Selector */}
          <div className="lg:hidden p-4 bg-slate-950 border-b border-white/5">
            <ScenarioSelector />
          </div>

          {/* Messages Scroll Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-8 md:px-12 scrollbar-hide"
          >
            <div className="max-w-3xl mx-auto space-y-2">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <MessageBubble key={`${idx}-${msg.timestamp}`} message={msg} />
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-slate-500 text-xs py-2"
                >
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                  </div>
                  <span>AI Teacher is thinking...</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 md:p-8 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={handleSendMessage} disabled={isTyping} />
              <p className="text-[10px] text-slate-600 text-center mt-3 uppercase tracking-tighter">
                Sohbet ederek İngilizce öğrenin. Hatalarınızdan korkmayın!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MOCK AI LOGIC ---
function getMockAIResponse(userInput: string, scenarioId: string): string {
  const input = userInput.toLowerCase();
  
  if (input.includes('hello') || input.includes('hi')) {
    return "Hello there! How's your day going? Would you like to practice some specific vocabulary related to our current scenario?";
  }
  
  if (input.includes('help') || input.includes('how to say')) {
    return "Of course! To express that more naturally in English, you might say: 'Could you please assist me?'. Your original sentence was also correct but this sounds more formal.";
  }

  // Scenario specific responses
  switch(scenarioId) {
    case 'airport':
      if (input.includes('passport')) return "Thank you. Everything seems to be in order. Do you have any luggage to check in, or just carry-on?";
      break;
    case 'restaurant':
      if (input.includes('menu')) return "Certainly! Here is our menu. Our special today is the grilled salmon with lemon butter sauce. Would you like to start with some drinks?";
      break;
    case 'interview':
      if (input.includes('experience')) return "That sounds very impressive. How did your previous role prepare you for the challenges of this position?";
      break;
  }

  return "I see. That's an interesting point! Could you tell me more about that? (By the way, your grammar was perfectly correct in that last sentence!)";
}
