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

vi.mock('@react-spring/three', () => ({
  useSpring: (props: Record<string, unknown>) => props,
  animated: {
    group: (props: Record<string, unknown>) => {
      const { children, scale, ...rest } = props as any;
      return <group {...rest}>{children}</group>;
    },
  },
}));

import ChessPiece from './ChessPiece';

describe('ChessPiece', () => {
  it('renders a piece with correct name attribute', () => {
    const { container } = render(
      <ChessPiece type="p" color="w" position={[0, 0, 0]} square="e2" />,
    );
    const piece = container.querySelector('[name="piece-p-w-e2"]');
    expect(piece).toBeInTheDocument();
  });

  it('renders GLTF model when usePieceModel succeeds', () => {
    render(
      <ChessPiece type="q" color="w" position={[0, 0, 0]} square="d1" />,
    );
    expect(mockUseGLTF).toHaveBeenCalled();
  });

  it('falls back to procedural geometry when useGLTF throws', () => {
    mockUseGLTF.mockImplementationOnce(() => {
      throw new Error('Failed to load');
    });
    const { container } = render(
      <ChessPiece type="k" color="b" position={[0, 0, 0]} square="e8" />,
    );
    const piece = container.querySelector('[name="piece-k-b-e8"]');
    expect(piece).toBeInTheDocument();
  });

  it('renders with selected state when isSelected', () => {
    const { container } = render(
      <ChessPiece type="p" color="w" position={[0, 0, 0]} square="e2" isSelected />,
    );
    const piece = container.querySelector('[name="piece-p-w-e2"]');
    expect(piece).toBeInTheDocument();
  });

  it('renders piece without click handlers (interaction via BoardSquare)', () => {
    const { container } = render(
      <ChessPiece
        type="p"
        color="w"
        position={[0, 0, 0]}
        square="e2"
      />,
    );
    const piece = container.querySelector('[name="piece-p-w-e2"]');
    expect(piece).toBeInTheDocument();
  });
});

describe('ChessPieces', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('renders 32 pieces in initial position', () => {
    const { container } = render(<ChessPieces />);
    const pieces = container.querySelectorAll('[name^="piece-"]');
    expect(pieces).toHaveLength(32);
  });

  it('renders correct total of 32 pieces', () => {
    const { container } = render(<ChessPieces />);
    const allPieces = container.querySelectorAll('[name^="piece-"]');
    expect(allPieces).toHaveLength(32);
  });

  it('renders pawns on ranks 2 and 7', () => {
    const { container } = render(<ChessPieces />);
    const pawns = container.querySelectorAll('[name^="piece-p-"]');
    expect(pawns).toHaveLength(16);
  });
});
