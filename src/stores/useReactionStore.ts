import { create } from 'zustand';

export interface Reaction {
  id: string;
  emoji: string;
  sender: string;
  timestamp: number;
}

interface ReactionState {
  reactions: Reaction[];
  addReaction: (emoji: string, sender: string) => void;
}

let reactionCounter = 0;

export const useReactionStore = create<ReactionState>((set, get) => ({
  reactions: [],

  addReaction: (emoji: string, sender: string) => {
    const id = `reaction-${++reactionCounter}-${Date.now()}`;
    const reaction: Reaction = { id, emoji, sender, timestamp: Date.now() };

    set({ reactions: [...get().reactions, reaction] });

    // Auto-remove after 3 seconds
    setTimeout(() => {
      set({ reactions: get().reactions.filter((r) => r.id !== id) });
    }, 3000);
  },
}));
