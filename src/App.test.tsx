import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  PerspectiveCamera: () => null,
  Text: ({ children }: any) => children,
}));

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
