import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Lobby from './Lobby';

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
    onCreateGame: vi.fn().mockResolvedValue('abc123'),
    onJoinGame: vi.fn().mockResolvedValue(undefined),
    onLocalGame: vi.fn(),
    createdGameId: null as string | null,
    connectionStatus: 'disconnected',
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

  it('renders Create Game Online button', () => {
    render(<Lobby {...defaultProps} />);
    expect(screen.getByRole('button', { name: /criar jogo online/i })).toBeInTheDocument();
  });

  it('renders Jogar Local button', () => {
    render(<Lobby {...defaultProps} />);
    expect(screen.getByRole('button', { name: /jogar local/i })).toBeInTheDocument();
  });

  it('renders Join button', () => {
    render(<Lobby {...defaultProps} />);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
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

  it('shows waiting state when createdGameId is set', () => {
    render(<Lobby {...defaultProps} createdGameId="xyz789" connectionStatus="connecting" />);
    expect(screen.getByText(/aguardando oponente/i)).toBeInTheDocument();
    expect(screen.getByText('xyz789')).toBeInTheDocument();
  });

  it('shows copy button in waiting state', () => {
    render(<Lobby {...defaultProps} createdGameId="xyz789" connectionStatus="connecting" />);
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument();
  });
});
