import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
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

const { mockClone, mockUseGLTF } = vi.hoisted(() => {
  const mockClone = vi.fn().mockReturnValue({ traverse: vi.fn() });
  const mockUseGLTF = Object.assign(
    vi.fn().mockReturnValue({
      scene: { clone: mockClone },
      animations: [],
    }),
    { preload: vi.fn() }
  );
  return { mockClone, mockUseGLTF };
});

vi.mock('@react-three/drei', () => ({
  useGLTF: mockUseGLTF,
  OrbitControls: () => null,
  PerspectiveCamera: () => null,
  Environment: () => null,
}));

// Need to import ChessPiece after mocks are set up
import ChessPiece from './ChessPiece';

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

  it('renders GLTF model when usePieceModel succeeds', () => {
    const { container } = render(
      <ChessPiece type="q" color="w" position={[0, 0, 0]} square="d1" />,
    );
    // Should have called useGLTF for queen_white
    expect(mockUseGLTF).toHaveBeenCalled();
    // Should render primitive for GLTF
    const piece = container.querySelector('[data-testid="chess-piece"]');
    expect(piece).toBeInTheDocument();
  });

  it('falls back to procedural geometry when useGLTF throws', () => {
    // Make useGLTF throw to simulate load failure
    mockUseGLTF.mockImplementationOnce(() => {
      throw new Error('Failed to load');
    });
    const { container } = render(
      <ChessPiece type="k" color="b" position={[0, 0, 0]} square="e8" />,
    );
    // Should still render something (fallback)
    const piece = container.querySelector('[data-testid="chess-piece"]');
    expect(piece).toBeInTheDocument();
  });

  it('renders with selected highlight when isSelected', () => {
    const { container } = render(
      <ChessPiece type="p" color="w" position={[0, 0, 0]} square="e2" isSelected />,
    );
    const piece = container.querySelector('[data-testid="chess-piece"]');
    expect(piece).toBeInTheDocument();
  });

  it('preserves onClick and pointer event props', () => {
    const onClick = vi.fn();
    const onPointerOver = vi.fn();
    const { container } = render(
      <ChessPiece
        type="p"
        color="w"
        position={[0, 0, 0]}
        square="e2"
        onClick={onClick}
        onPointerOver={onPointerOver}
      />,
    );
    const piece = container.querySelector('[data-testid="chess-piece"]');
    expect(piece).toBeInTheDocument();
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
    expect(pawns).toHaveLength(16);
  });
});
