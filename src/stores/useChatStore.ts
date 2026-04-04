import { create } from 'zustand';
import type { Color } from 'chess.js';

export interface ChatMessage {
  id: string;
  sender: Color;
  text: string;
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  unreadCount: number;

  addMessage: (sender: Color, text: string) => void;
  toggleChat: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  unreadCount: 0,

  addMessage: (sender, text) => {
    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender,
      text: text.trim(),
      timestamp: Date.now(),
    };
    set((s) => ({
      messages: [...s.messages, msg],
      unreadCount: s.isOpen ? 0 : s.unreadCount + 1,
    }));
  },

  toggleChat: () =>
    set((s) => ({
      isOpen: !s.isOpen,
      unreadCount: !s.isOpen ? 0 : s.unreadCount,
    })),

  clearMessages: () => set({ messages: [], unreadCount: 0, isOpen: false }),
}));
