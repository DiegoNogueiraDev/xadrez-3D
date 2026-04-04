import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CapturedPieces from './CapturedPieces';
import { useGameStore } from '../stores/useGameStore';

describe('CapturedPieces', () => {
  beforeEach(() => {
    useGameStore.setState({
      capturedPieces: { w: [], b: [] },
    });
  });

  it('renders with data-testid captured-pieces', () => {
    render(<CapturedPieces />);
    expect(screen.getByTestId('captured-pieces')).toBeInTheDocument();
  });

  it('renders both capture sections', () => {
    render(<CapturedPieces />);
    expect(screen.getByTestId('captures-white')).toBeInTheDocument();
    expect(screen.getByTestId('captures-black')).toBeInTheDocument();
  });

  it('shows captured pieces as unicode symbols', () => {
    useGameStore.setState({
      capturedPieces: {
        w: [{ type: 'p', color: 'b' }],
        b: [],
      },
    });
    render(<CapturedPieces />);
    expect(screen.getByTestId('captures-white')).toHaveTextContent('♟');
  });

  it('shows multiple captures', () => {
    useGameStore.setState({
      capturedPieces: {
        w: [{ type: 'p', color: 'b' }, { type: 'n', color: 'b' }],
        b: [{ type: 'p', color: 'w' }],
      },
    });
    render(<CapturedPieces />);
    expect(screen.getByTestId('captures-white')).toHaveTextContent('♟');
    expect(screen.getByTestId('captures-white')).toHaveTextContent('♞');
    expect(screen.getByTestId('captures-black')).toHaveTextContent('♙');
  });
});
