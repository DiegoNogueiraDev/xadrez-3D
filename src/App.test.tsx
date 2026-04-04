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
  ContactShadows: () => null,
  useGLTF: Object.assign(
    () => ({ scene: { clone: () => ({ traverse: () => {} }) }, animations: [] }),
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

vi.mock('./hooks/useAudioSync', () => ({
  useAudioSync: vi.fn(),
}));

vi.mock('./hooks/useNetwork', () => {
  return {
    useNetwork: () => ({
      createGame: vi.fn().mockResolvedValue('abc123'),
      joinGame: vi.fn().mockResolvedValue(undefined),
      startLocalGame: vi.fn(),
      disconnect: vi.fn(),
      connectionStatus: 'disconnected',
      gameId: null,
    }),
  };
});

vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: any) => children,
  Bloom: () => null,
  Vignette: () => null,
  SSAO: () => null,
}));

vi.mock('@react-spring/three', () => ({
  useSpring: (props: any) => props,
  animated: {
    group: (props: any) => {
      const { children, scale, ...rest } = props;
      return <group {...rest}>{children}</group>;
    },
  },
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

  it('renders Jogar Local button in lobby', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /jogar local/i })).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<App />);
    const titles = screen.getAllByText(/xadrez 3d/i);
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });
});
