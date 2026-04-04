import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingScreen from './LoadingScreen';

describe('LoadingScreen', () => {
  it('renders with data-testid loading-screen', () => {
    render(<LoadingScreen progress={0} />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('renders progress bar element', () => {
    render(<LoadingScreen progress={0} />);
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
  });

  it('shows loading text', () => {
    render(<LoadingScreen progress={0} />);
    expect(screen.getByTestId('loading-text')).toHaveTextContent('Carregando...');
  });

  it('displays 0% progress', () => {
    render(<LoadingScreen progress={0} />);
    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  it('displays 50% progress', () => {
    render(<LoadingScreen progress={50} />);
    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
  });

  it('displays 100% progress', () => {
    render(<LoadingScreen progress={100} />);
    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
  });

  it('has correct aria attributes for accessibility', () => {
    render(<LoadingScreen progress={75} />);
    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '75');
    expect(bar).toHaveAttribute('role', 'progressbar');
  });
});
