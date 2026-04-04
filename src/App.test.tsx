import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the chess app container', () => {
    render(<App />);
    expect(screen.getByTestId('chess-app')).toBeInTheDocument();
  });

  it('renders with correct title', () => {
    render(<App />);
    expect(screen.getByText(/xadrez 3d/i)).toBeInTheDocument();
  });
});
