import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Message } from '../../../lib/schema';
import { Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // PREMIUM UI: Cancel any existing speech before starting new one
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      utterance.onstart = () => toast.info('Speaking...', { duration: 1000 });
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Browser does not support text-to-speech');
    }
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-500">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mb-6",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-xl relative group",
        isAssistant 
          ? "bg-white/10 border border-white/10 text-white rounded-tl-none" 
          : "bg-indigo-600 text-white rounded-tr-none"
      )}>
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        <div className={cn(
          "flex items-center gap-2 mt-2 text-[10px] opacity-50",
          isAssistant ? "justify-start" : "justify-end"
        )}>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isAssistant && (
            <button 
              onClick={() => speak(message.content)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              title="Listen"
            >
              <Volume2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* PREMIUM UI: AI Feedback Simulation (Grammar Check) */}
        {isAssistant && message.content.includes('correct') && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">Tip:</span> Your sentence structure was perfect.
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
