import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useReactionStore } from './useReactionStore';

describe('useReactionStore', () => {
  beforeEach(() => {
    useReactionStore.setState({ reactions: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('starts with empty reactions', () => {
      expect(useReactionStore.getState().reactions).toEqual([]);
    });
  });

  describe('addReaction', () => {
    it('adds a reaction with correct fields', () => {
      useReactionStore.getState().addReaction('👏', 'w');
      const { reactions } = useReactionStore.getState();
      expect(reactions).toHaveLength(1);
      expect(reactions[0]).toMatchObject({
        emoji: '👏',
        sender: 'w',
      });
      expect(reactions[0].id).toBeDefined();
      expect(reactions[0].timestamp).toBeDefined();
    });

    it('adds multiple reactions', () => {
      useReactionStore.getState().addReaction('👏', 'w');
      useReactionStore.getState().addReaction('🔥', 'b');
      useReactionStore.getState().addReaction('😂', 'spectator');
      expect(useReactionStore.getState().reactions).toHaveLength(3);
    });

    it('supports spectator as sender', () => {
      useReactionStore.getState().addReaction('💀', 'spectator');
      const { reactions } = useReactionStore.getState();
      expect(reactions[0].sender).toBe('spectator');
    });

    it('auto-removes reaction after 3 seconds', () => {
      useReactionStore.getState().addReaction('👏', 'w');
      expect(useReactionStore.getState().reactions).toHaveLength(1);

      vi.advanceTimersByTime(3000);
      expect(useReactionStore.getState().reactions).toHaveLength(0);
    });

    it('removes only the expired reaction, keeping others', () => {
      useReactionStore.getState().addReaction('👏', 'w');

      vi.advanceTimersByTime(1500);
      useReactionStore.getState().addReaction('🔥', 'b');

      // First reaction expires at 3000ms
      vi.advanceTimersByTime(1500);
      const { reactions } = useReactionStore.getState();
      expect(reactions).toHaveLength(1);
      expect(reactions[0].emoji).toBe('🔥');

      // Second reaction expires at 4500ms
      vi.advanceTimersByTime(1500);
      expect(useReactionStore.getState().reactions).toHaveLength(0);
    });

    it('generates unique ids for each reaction', () => {
      useReactionStore.getState().addReaction('👏', 'w');
      useReactionStore.getState().addReaction('👏', 'w');
      const { reactions } = useReactionStore.getState();
      expect(reactions[0].id).not.toBe(reactions[1].id);
    });
  });
});
