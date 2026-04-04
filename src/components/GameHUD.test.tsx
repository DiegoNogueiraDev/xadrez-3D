import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameHUD from './GameHUD';
import { useGameStore } from '../stores/useGameStore';

describe('GameHUD', () => {
  beforeEach(() => {
    useGameStore.setState({
      turn: 'w',
      playerColor: 'w',
      gamePhase: 'playing',
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
    });
  });

  it('renders with data-testid game-hud', () => {
    render(<GameHUD />);
    expect(screen.getByTestId('game-hud')).toBeInTheDocument();
  });

  it('displays Brancas when turn is white', () => {
    render(<GameHUD />);
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Brancas');
  });

  it('displays Pretas when turn is black', () => {
    useGameStore.setState({ turn: 'b' });
    render(<GameHUD />);
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Pretas');
  });

  it('displays player color badge', () => {
    render(<GameHUD />);
    expect(screen.getByTestId('player-color')).toBeInTheDocument();
  });

  it('displays game status', () => {
    render(<GameHUD />);
    expect(screen.getByTestId('game-status')).toBeInTheDocument();
  });

  it('shows Xeque! when isCheck is true', () => {
    useGameStore.setState({ isCheck: true });
    render(<GameHUD />);
    expect(screen.getByTestId('game-status')).toHaveTextContent('Xeque!');
  });

  it('shows Xeque-mate! when isCheckmate is true', () => {
    useGameStore.setState({ isCheckmate: true });
    render(<GameHUD />);
    expect(screen.getByTestId('game-status')).toHaveTextContent('Xeque-mate!');
  });

  it('shows Empate when isStalemate is true', () => {
    useGameStore.setState({ isStalemate: true });
    render(<GameHUD />);
    expect(screen.getByTestId('game-status')).toHaveTextContent('Empate');
  });

  it('shows Jogando when no special status', () => {
    render(<GameHUD />);
    expect(screen.getByTestId('game-status')).toHaveTextContent('Jogando');
  });
});
