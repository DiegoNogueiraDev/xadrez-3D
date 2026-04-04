import { describe, it, expect } from 'vitest';
import type { GameMessage } from './NetworkManager';

describe('NetworkManager message types', () => {
  it('reaction is a valid message type', () => {
    const msg: GameMessage = {
      type: 'reaction',
      data: { emoji: '👏', sender: 'w' },
    };
    expect(msg.type).toBe('reaction');
    expect(msg.data.emoji).toBe('👏');
    expect(msg.data.sender).toBe('w');
  });

  it('reaction supports spectator sender', () => {
    const msg: GameMessage = {
      type: 'reaction',
      data: { emoji: '🔥', sender: 'spectator' },
    };
    expect(msg.data.sender).toBe('spectator');
  });
});
