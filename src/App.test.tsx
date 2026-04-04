import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGameStore } from './stores/useGameStore';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  PerspectiveCamera: () => null,
  Text: ({ children }: any) => children,
  Environment: () => null,
  useGLTF: Object.assign(
    () => ({ scene: { clone: () => ({}) }, animations: [] }),
    { preload: () => {} }
  ),
}));

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

// Mock soundManager
vi.mock('./lib/sounds', () => ({
  soundManager: { init: vi.fn(), play: vi.fn() },
  SoundManager: class {},
}));

vi.mock('./lib/soundAssets', () => ({
  SOUND_MANIFEST: {},
  getSoundPath: () => '',
  getSoundPaths: () => [],
}));

vi.mock('./hooks/useAudioResume', () => ({
  useAudioResume: vi.fn(),
}));

import App from './App';

describe('App', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('renders the chess app container', () => {
    render(<App />);
    expect(screen.getByTestId('chess-app')).toBeInTheDocument();
  });

  it('renders Lobby when gamePhase is lobby', () => {
    render(<App />);
    expect(screen.getByTestId('lobby-dialog')).toBeInTheDocument();
  });

  it('does not render ChessScene in lobby phase', () => {
    render(<App />);
    expect(screen.queryByTestId('r3f-canvas')).not.toBeInTheDocument();
  });

  it('renders ChessScene when gamePhase is playing', () => {
    useGameStore.getState().setGamePhase('playing');
    render(<App />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('transitions from lobby to playing when Create Game is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /criar jogo/i }));
    expect(useGameStore.getState().gamePhase).toBe('playing');
  });

  it('renders title', () => {
    render(<App />);
    const titles = screen.getAllByText(/xadrez 3d/i);
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });
});
