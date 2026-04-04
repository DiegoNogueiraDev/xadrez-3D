import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ChessScene from './ChessScene';

// Mock R3F Canvas since WebGL isn't available in jsdom
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
  OrbitControls: () => null,
  PerspectiveCamera: ({ makeDefault, position, fov }: any) => (
    <div
      data-testid="perspective-camera"
      data-position={JSON.stringify(position)}
      data-fov={fov}
      data-makedefault={makeDefault}
    />
  ),
  Text: ({ children, ...props }: any) => (
    <div data-testid="drei-text" data-text={children} {...props}>
      {children}
    </div>
  ),
  Environment: (props: any) => (
    <div data-testid="drei-environment" data-files={props.files} />
  ),
}));

describe('ChessScene', () => {
  it('renders the R3F Canvas container', () => {
    const { getByTestId } = render(<ChessScene />);
    expect(getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('includes a perspective camera', () => {
    const { getByTestId } = render(<ChessScene />);
    expect(getByTestId('perspective-camera')).toBeInTheDocument();
  });

  it('renders ambient light and directional light', () => {
    const { container } = render(<ChessScene />);
    // R3F lights render as JSX elements in our mock
    expect(container.querySelector('ambientLight')).toBeInTheDocument();
    expect(container.querySelector('directionalLight')).toBeInTheDocument();
  });
});
