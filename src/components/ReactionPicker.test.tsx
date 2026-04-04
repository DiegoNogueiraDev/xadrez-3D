import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGameStore } from '../stores/useGameStore';
import { useReactionStore } from '../stores/useReactionStore';

vi.mock('../network/NetworkManager', () => ({
  networkManager: {
    send: vi.fn(),
  },
}));

import { networkManager } from '../network/NetworkManager';
import ReactionPicker from './ReactionPicker';

describe('ReactionPicker', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
    useReactionStore.setState({ reactions: [] });
    vi.clearAllMocks();
  });

  it('renders all 6 reaction buttons', () => {
    render(<ReactionPicker />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6);
  });

  it('renders expected emojis', () => {
    render(<ReactionPicker />);
    const buttons = screen.getAllByRole('button');
    const emojis = buttons.map((b) => b.textContent);
    expect(emojis).toEqual(['👏', '😮', '😂', '🔥', '👎', '💀']);
  });

  it('adds reaction to store when clicked', () => {
    useGameStore.setState({ playerRole: 'player', playerColor: 'w' });
    render(<ReactionPicker />);
    fireEvent.click(screen.getAllByRole('button')[0]); // 👏
    const { reactions } = useReactionStore.getState();
    expect(reactions).toHaveLength(1);
    expect(reactions[0].emoji).toBe('👏');
    expect(reactions[0].sender).toBe('w');
  });

  it('sends reaction over network when online', () => {
    useGameStore.setState({ playerRole: 'player', playerColor: 'b', isOnline: true });
    render(<ReactionPicker />);
    fireEvent.click(screen.getAllByRole('button')[3]); // 🔥
    expect(networkManager.send).toHaveBeenCalledWith({
      type: 'reaction',
      data: { emoji: '🔥', sender: 'b' },
    });
  });

  it('does not send over network when offline', () => {
    useGameStore.setState({ playerRole: 'player', playerColor: 'w', isOnline: false });
    render(<ReactionPicker />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(networkManager.send).not.toHaveBeenCalled();
  });

  it('uses "spectator" as sender for spectators', () => {
    useGameStore.setState({ playerRole: 'spectator', isOnline: true });
    render(<ReactionPicker />);
    fireEvent.click(screen.getAllByRole('button')[0]); // 👏
    const { reactions } = useReactionStore.getState();
    expect(reactions[0].sender).toBe('spectator');
    expect(networkManager.send).toHaveBeenCalledWith({
      type: 'reaction',
      data: { emoji: '👏', sender: 'spectator' },
    });
  });

  it('allows spectators to send reactions (unlike chat)', () => {
    useGameStore.setState({ playerRole: 'spectator', isOnline: true });
    render(<ReactionPicker />);
    const buttons = screen.getAllByRole('button');
    // All buttons should be clickable — no disabled state
    buttons.forEach((btn) => {
      expect(btn).not.toBeDisabled();
    });
  });
});
