import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PromotionDialog from './PromotionDialog';

describe('PromotionDialog', () => {
  const defaultProps = {
    onSelect: vi.fn(),
    playerColor: 'w' as const,
  };

  it('renders with data-testid promotion-dialog', () => {
    render(<PromotionDialog {...defaultProps} />);
    expect(screen.getByTestId('promotion-dialog')).toBeInTheDocument();
  });

  it('renders 4 promotion option buttons', () => {
    render(<PromotionDialog {...defaultProps} />);
    expect(screen.getByTestId('promote-q')).toBeInTheDocument();
    expect(screen.getByTestId('promote-r')).toBeInTheDocument();
    expect(screen.getByTestId('promote-b')).toBeInTheDocument();
    expect(screen.getByTestId('promote-n')).toBeInTheDocument();
  });

  it('displays piece labels', () => {
    render(<PromotionDialog {...defaultProps} />);
    expect(screen.getByText('Rainha')).toBeInTheDocument();
    expect(screen.getByText('Torre')).toBeInTheDocument();
    expect(screen.getByText('Bispo')).toBeInTheDocument();
    expect(screen.getByText('Cavalo')).toBeInTheDocument();
  });

  it('calls onSelect with "q" when queen is clicked', () => {
    render(<PromotionDialog {...defaultProps} />);
    fireEvent.click(screen.getByTestId('promote-q'));
    expect(defaultProps.onSelect).toHaveBeenCalledWith('q');
  });

  it('calls onSelect with "r" when rook is clicked', () => {
    const onSelect = vi.fn();
    render(<PromotionDialog onSelect={onSelect} playerColor="w" />);
    fireEvent.click(screen.getByTestId('promote-r'));
    expect(onSelect).toHaveBeenCalledWith('r');
  });

  it('calls onSelect with "b" when bishop is clicked', () => {
    const onSelect = vi.fn();
    render(<PromotionDialog onSelect={onSelect} playerColor="w" />);
    fireEvent.click(screen.getByTestId('promote-b'));
    expect(onSelect).toHaveBeenCalledWith('b');
  });

  it('calls onSelect with "n" when knight is clicked', () => {
    const onSelect = vi.fn();
    render(<PromotionDialog onSelect={onSelect} playerColor="w" />);
    fireEvent.click(screen.getByTestId('promote-n'));
    expect(onSelect).toHaveBeenCalledWith('n');
  });
});
