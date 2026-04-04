import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ChessScene from './ChessScene';

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
  ContactShadows: () => <div data-testid="contact-shadows" />,
  useGLTF: Object.assign(
    () => ({ scene: { clone: () => ({}) }, animations: [] }),
    { preload: () => {} }
  ),
}));

vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: any) => <div data-testid="effect-composer">{children}</div>,
  Bloom: () => null,
  Vignette: () => null,
}));

vi.mock('@react-spring/three', () => ({
  useSpring: (props: any) => props,
  animated: {
    group: (props: any) => {
      const { children, scale, ...rest } = props;
      return <group {...rest}>{children}</group>;
    },
  },
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

  it('renders the scene with environment', () => {
    const { getByTestId } = render(<ChessScene />);
    expect(getByTestId('drei-environment')).toBeInTheDocument();
  });
});
