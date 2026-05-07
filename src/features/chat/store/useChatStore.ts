import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '../../../lib/schema';

/**
 * AI Öğretmen Senaryoları
 */
export type Scenario = {
  id: string;
  name: string;
  icon: string;
  description: string;
  initialMessage: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'general',
    name: 'Genel Sohbet',
    icon: '💬',
    description: 'Günlük konular hakkında serbestçe konuşun.',
    initialMessage: 'Hello! I am your AI Teacher. How can I help you improve your English today?'
  },
  {
    id: 'airport',
    name: 'Havaalanı',
    icon: '✈️',
    description: 'Check-in ve güvenlik geçişi pratiği yapın.',
    initialMessage: 'Welcome to Antigravity Airways. May I see your passport and ticket, please?'
  },
  {
    id: 'restaurant',
    name: 'Restoran',
    icon: '🍕',
    description: 'Sipariş verme ve ödeme senaryosu.',
    initialMessage: 'Good evening! Have you decided what you would like to order?'
  },
  {
    id: 'interview',
    name: 'İş Görüşmesi',
    icon: '💼',
    description: 'Profesyonel mülakat pratiği.',
    initialMessage: 'Thank you for coming today. Could you start by telling me a little bit about yourself?'
  }
];

interface ChatState {
  messages: Message[];
  activeScenarioId: string;
  isTyping: boolean;
  addMessage: (message: Omit<Message, 'timestamp'>) => void;
  setScenario: (id: string) => void;
  setTyping: (typing: boolean) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      activeScenarioId: 'general',
      isTyping: false,
      
      addMessage: (msg) => set((state) => ({
        messages: [...state.messages, { ...msg, timestamp: new Date() } as Message]
      })),
      
      setScenario: (id) => set((state) => {
        const scenario = SCENARIOS.find(s => s.id === id);
        return {
          activeScenarioId: id,
          messages: [{
            role: 'assistant',
            content: scenario?.initialMessage || '',
            timestamp: new Date()
          }]
        };
      }),
      
      setTyping: (typing) => set({ isTyping: typing }),
      
      clearHistory: () => set({ messages: [] })
    }),
    {
      name: 'ai-teacher-chat-storage',
      // Date objelerini JSON'dan geri döndürürken Date tipine çevirmek için
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.messages = state.messages.map(m => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }));
        }
      }
    }
  )
);
