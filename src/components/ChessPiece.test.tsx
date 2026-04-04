import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ChessPiece from './ChessPiece';
import ChessPieces from './ChessPieces';
import { useGameStore } from '../stores/useGameStore';

vi.mock('@react-three/fiber', async () => {
  const actual = await vi.importActual('@react-three/fiber');
  return {
    ...actual,
    Canvas: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="r3f-canvas">{children}</div>
    ),
  };
});

vi.mock('@react-three/drei', () => ({
  useGLTF: () => ({
    scene: { clone: () => ({ traverse: () => {} }) },
  }),
}));

describe('ChessPiece', () => {
  it('renders a piece with correct data attributes', () => {
    const { container } = render(
      <ChessPiece type="p" color="w" position={[0, 0, 0]} square="e2" />,
    );
    const piece = container.querySelector('[data-testid="chess-piece"]');
    expect(piece).toBeInTheDocument();
    expect(piece?.getAttribute('data-type')).toBe('p');
    expect(piece?.getAttribute('data-color')).toBe('w');
    expect(piece?.getAttribute('data-square')).toBe('e2');
  });

  it('renders with white material for white pieces', () => {
    const { container } = render(
      <ChessPiece type="q" color="w" position={[0, 0, 0]} square="d1" />,
    );
    const piece = container.querySelector('[data-testid="chess-piece"]');
    expect(piece?.getAttribute('data-color')).toBe('w');
  });

  it('renders with black material for black pieces', () => {
    const { container } = render(
      <ChessPiece type="k" color="b" position={[0, 0, 0]} square="e8" />,
    );
    const piece = container.querySelector('[data-testid="chess-piece"]');
    expect(piece?.getAttribute('data-color')).toBe('b');
  });
});

describe('ChessPieces', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('renders 32 pieces in initial position', () => {
    const { container } = render(<ChessPieces />);
    const pieces = container.querySelectorAll('[data-testid="chess-piece"]');
    expect(pieces).toHaveLength(32);
  });

  it('renders correct number of each color', () => {
    const { container } = render(<ChessPieces />);
    const whitePieces = container.querySelectorAll('[data-color="w"]');
    const blackPieces = container.querySelectorAll('[data-color="b"]');
    expect(whitePieces).toHaveLength(16);
    expect(blackPieces).toHaveLength(16);
  });

  it('renders pawns on ranks 2 and 7', () => {
    const { container } = render(<ChessPieces />);
    const pawns = container.querySelectorAll('[data-type="p"]');
    expect(pawns).toHaveLength(16); // 8 white + 8 black
  });
});
