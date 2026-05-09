import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, SCENARIOS } from './store/useChatStore';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { ScenarioSelector } from './components/ScenarioSelector';
import { Sparkles, Trash2, GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface ChatViewProps {
  onBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onBack }) => {
  const { activeScenarioId } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId);

  const chat = useChat({
    api: '/api/chat',
    body: {
      scenario: activeScenario?.name || 'General'
    },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: activeScenario?.initialMessage || 'Hello! Ready to practice?'
      }
    ],
    onResponse: (response) => {
      if (!response.ok) toast.error('AI connection failed. Check your API key.');
    },
    onError: (err) => {
      console.error('Chat Error:', err);
    }
  });

  const { messages, setMessages, sendMessage, isLoading, error } = chat;

  // Sync initial message when scenario changes
  useEffect(() => {
    if (activeScenario) {
      setMessages([
        {
          id: 'welcome-' + activeScenario.id + '-' + Date.now(),
          role: 'assistant',
          content: activeScenario.initialMessage,
          timestamp: new Date()
        } as any
      ]);
    }
  }, [activeScenarioId, setMessages]); // Reset chat when scenario changes

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    try {
      // Use sendMessage which was found in the hook's return keys
      if (typeof sendMessage === 'function') {
        // AI SDK usually expects an object with 'content' or 'text'
        // Given the previous error, let's try 'content' which is more standard
        await sendMessage({ content: text }); 
      } else {
        console.error('sendMessage is not a function');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
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
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  error ? "bg-rose-500" : "bg-emerald-500 animate-pulse"
                )} />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  {error ? "API Connection Error" : "Real AI Online"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            if(confirm('Clear all chat history?')) {
              // useChat doesn't have a direct clear, so we might need to refresh or handle it
              window.location.reload(); 
            }
          }}
          className="p-2.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-xl transition-all"
          title="Clear History"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Sidebar: Scenarios */}
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
          <div className="lg:hidden p-4 bg-slate-950 border-b border-white/5">
            <ScenarioSelector />
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-8 md:px-12"
          >
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <MessageBubble key={msg.id} message={{
                    role: msg.role as any,
                    content: msg.content || (msg as any).text || '',
                    timestamp: (msg as any).timestamp || new Date()
                  }} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-600 space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 opacity-20" />
                  </div>
                  <p className="text-sm font-medium">Sohbet henüz başlamadı.</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-50">AI Teacher hazır bekliyor...</p>
                </div>
              )}
              
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                  <span>AI Teacher is generating response...</span>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  API Key eksik veya geçersiz. Lütfen .env dosyasını kontrol edin.
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 md:p-8 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
              <p className="text-[10px] text-slate-600 text-center mt-3 uppercase tracking-tighter">
                Gerçek AI ile konuşuyorsunuz. Hatalarınız otomatik olarak düzeltilecektir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
