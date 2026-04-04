import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MoveHistory from './MoveHistory';
import { useGameStore } from '../stores/useGameStore';

describe('MoveHistory', () => {
  beforeEach(() => {
    useGameStore.setState({ moveHistory: [] });
  });

  it('renders with data-testid move-history', () => {
    render(<MoveHistory />);
    expect(screen.getByTestId('move-history')).toBeInTheDocument();
  });

  it('shows empty state when no moves', () => {
    render(<MoveHistory />);
    expect(screen.getByText('Sem jogadas')).toBeInTheDocument();
  });

  it('renders move rows when moves exist', () => {
    useGameStore.setState({ moveHistory: ['e4', 'e5', 'Nf3'] });
    render(<MoveHistory />);
    expect(screen.getByTestId('move-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('move-row-2')).toBeInTheDocument();
  });

  it('displays paired notation format', () => {
    useGameStore.setState({ moveHistory: ['e4', 'e5'] });
    render(<MoveHistory />);
    const row = screen.getByTestId('move-row-1');
    expect(row).toHaveTextContent('1.');
    expect(row).toHaveTextContent('e4');
    expect(row).toHaveTextContent('e5');
  });
});
