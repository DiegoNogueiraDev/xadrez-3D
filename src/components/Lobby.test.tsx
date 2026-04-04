import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Lobby from './Lobby';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const React = require('react');
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return React.createElement('div', rest, children);
    },
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('Lobby', () => {
  const defaultProps = {
    onCreateGame: vi.fn(),
    onJoinGame: vi.fn(),
  };

  it('renders the lobby dialog', () => {
    render(<Lobby {...defaultProps} />);
    expect(screen.getByTestId('lobby-dialog')).toBeInTheDocument();
  });

  it('renders a game ID input field', () => {
    render(<Lobby {...defaultProps} />);
    const input = screen.getByPlaceholderText(/game id/i);
    expect(input).toBeInTheDocument();
  });

  it('renders Create Game button', () => {
    render(<Lobby {...defaultProps} />);
    expect(screen.getByRole('button', { name: /criar jogo/i })).toBeInTheDocument();
  });

  it('renders Join Game button', () => {
    render(<Lobby {...defaultProps} />);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('calls onCreateGame when Create button is clicked', () => {
    render(<Lobby {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /criar jogo/i }));
    expect(defaultProps.onCreateGame).toHaveBeenCalledTimes(1);
  });

  it('calls onJoinGame with game ID when Join button is clicked', () => {
    render(<Lobby {...defaultProps} />);
    const input = screen.getByPlaceholderText(/game id/i);
    fireEvent.change(input, { target: { value: 'abc123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(defaultProps.onJoinGame).toHaveBeenCalledWith('abc123');
  });

  it('disables Join button when game ID is empty', () => {
    render(<Lobby {...defaultProps} />);
    const joinBtn = screen.getByRole('button', { name: /entrar/i });
    expect(joinBtn).toBeDisabled();
  });

  it('enables Join button when game ID is entered', () => {
    render(<Lobby {...defaultProps} />);
    const input = screen.getByPlaceholderText(/game id/i);
    fireEvent.change(input, { target: { value: 'abc123' } });
    const joinBtn = screen.getByRole('button', { name: /entrar/i });
    expect(joinBtn).not.toBeDisabled();
  });
});
