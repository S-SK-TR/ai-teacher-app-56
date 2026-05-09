import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl focus-within:border-indigo-500/50 transition-colors"
    >
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message in English..."
        rows={1}
        className={cn(
          "flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500 resize-none py-3 px-4 max-h-32 min-h-[52px]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        disabled={disabled}
      />
      
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={cn(
          "p-3 rounded-xl transition-all duration-200 flex items-center justify-center",
          message.trim() && !disabled 
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:scale-105" 
            : "bg-white/5 text-slate-500 cursor-not-allowed"
        )}
      >
        {disabled ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};
