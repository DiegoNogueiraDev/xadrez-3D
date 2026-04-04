import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useReactionStore } from '../stores/useReactionStore';
import ReactionOverlay from './ReactionOverlay';

describe('ReactionOverlay', () => {
  beforeEach(() => {
    useReactionStore.setState({ reactions: [] });
  });

  it('renders nothing when no reactions', () => {
    const { container } = render(<ReactionOverlay />);
    expect(container.firstChild).toBeNull();
  });

  it('renders reaction emojis when present', () => {
    useReactionStore.setState({
      reactions: [
        { id: 'r1', emoji: '👏', sender: 'w', timestamp: Date.now() },
        { id: 'r2', emoji: '🔥', sender: 'b', timestamp: Date.now() },
      ],
    });
    render(<ReactionOverlay />);
    expect(screen.getByText('👏')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
  });

  it('applies float animation class', () => {
    useReactionStore.setState({
      reactions: [{ id: 'r1', emoji: '😂', sender: 'w', timestamp: Date.now() }],
    });
    render(<ReactionOverlay />);
    const emoji = screen.getByText('😂');
    expect(emoji.className).toContain('animate-reaction-float');
  });

  it('overlay container is pointer-events-none', () => {
    useReactionStore.setState({
      reactions: [{ id: 'r1', emoji: '👏', sender: 'w', timestamp: Date.now() }],
    });
    const { container } = render(<ReactionOverlay />);
    expect(container.firstChild).toHaveClass('pointer-events-none');
  });
});
