import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ChessBoard from './ChessBoard';

// Mock R3F primitives
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
  Text: ({ children, ...props }: any) => (
    <div data-testid="drei-text" data-text={children} {...props}>
      {children}
    </div>
  ),
}));

describe('ChessBoard', () => {
  it('renders 64 board squares', () => {
    const { container } = render(<ChessBoard />);
    const squares = container.querySelectorAll('[data-testid="board-square"]');
    expect(squares).toHaveLength(64);
  });

  it('renders squares with alternating colors', () => {
    const { container } = render(<ChessBoard />);
    const squares = container.querySelectorAll('[data-testid="board-square"]');
    const lightSquares = Array.from(squares).filter(
      (sq) => sq.getAttribute('data-color') === 'light',
    );
    const darkSquares = Array.from(squares).filter(
      (sq) => sq.getAttribute('data-color') === 'dark',
    );
    expect(lightSquares).toHaveLength(32);
    expect(darkSquares).toHaveLength(32);
  });

  it('renders a board border', () => {
    const { container } = render(<ChessBoard />);
    expect(container.querySelector('[data-testid="board-border"]')).toBeInTheDocument();
  });

  it('renders coordinate labels', () => {
    const { container } = render(<ChessBoard />);
    const labels = container.querySelectorAll('[data-testid="drei-text"]');
    // 8 file labels (a-h) + 8 rank labels (1-8) = 16
    expect(labels.length).toBeGreaterThanOrEqual(16);
  });

  it('assigns correct square names', () => {
    const { container } = render(<ChessBoard />);
    const squares = container.querySelectorAll('[data-testid="board-square"]');
    const squareNames = Array.from(squares).map((sq) => sq.getAttribute('data-square'));
    expect(squareNames).toContain('a1');
    expect(squareNames).toContain('e4');
    expect(squareNames).toContain('h8');
  });
});
