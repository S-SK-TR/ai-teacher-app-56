import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

const inputSchema = z.object({
  message: z.string().min(1, 'Please enter a message'),
});

type InputData = z.infer<typeof inputSchema>;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<InputData>({
    resolver: zodResolver(inputSchema),
    mode: 'onChange'
  });

  const onSubmit = (data: InputData) => {
    onSend(data.message);
    reset();
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex items-end gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl focus-within:border-indigo-500/50 transition-colors"
    >
      <textarea
        {...register('message')}
        placeholder="Type your message in English..."
        rows={1}
        className={cn(
          "flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500 resize-none py-3 px-4 max-h-32",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }
        }}
        disabled={disabled}
      />
      
      <button
        type="submit"
        disabled={!isValid || disabled}
        className={cn(
          "p-3 rounded-xl transition-all duration-200 flex items-center justify-center",
          isValid && !disabled 
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

      {errors.message && (
        <div className="absolute -top-8 left-4 text-[10px] text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20">
          {errors.message.message}
        </div>
      )}
    </form>
  );
};
