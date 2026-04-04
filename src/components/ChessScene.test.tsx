import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useGameStore } from '../stores/useGameStore';
import { CAMERA } from '../utils/constants';

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
  OrbitControls: (props: any) => (
    <div
      data-testid="orbit-controls"
      data-enable-pan={String(props.enablePan)}
      data-min-polar-angle={String(props.minPolarAngle)}
      data-max-polar-angle={String(props.maxPolarAngle)}
      data-min-distance={String(props.minDistance)}
      data-max-distance={String(props.maxDistance)}
    />
  ),
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
    () => ({ scene: { clone: () => ({ traverse: () => {} }) }, animations: [] }),
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

import ChessScene from './ChessScene';

describe('ChessScene', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('renders the R3F Canvas container', () => {
    render(<ChessScene />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('includes a perspective camera', () => {
    render(<ChessScene />);
    expect(screen.getByTestId('perspective-camera')).toBeInTheDocument();
  });

  it('renders the scene with environment', () => {
    render(<ChessScene />);
    expect(screen.getByTestId('drei-environment')).toBeInTheDocument();
  });

  describe('camera position by player role', () => {
    it('uses white position for white player', () => {
      useGameStore.setState({ playerColor: 'w', playerRole: 'player', isOnline: true });
      render(<ChessScene />);
      const camera = screen.getByTestId('perspective-camera');
      const position = JSON.parse(camera.getAttribute('data-position')!);
      expect(position).toEqual([CAMERA.whitePosition.x, CAMERA.whitePosition.y, CAMERA.whitePosition.z]);
    });

    it('uses black position for black player in online mode', () => {
      useGameStore.setState({ playerColor: 'b', playerRole: 'player', isOnline: true });
      render(<ChessScene />);
      const camera = screen.getByTestId('perspective-camera');
      const position = JSON.parse(camera.getAttribute('data-position')!);
      expect(position).toEqual([CAMERA.blackPosition.x, CAMERA.blackPosition.y, CAMERA.blackPosition.z]);
    });

    it('uses white position for black player in local mode', () => {
      useGameStore.setState({ playerColor: 'b', playerRole: 'player', isOnline: false });
      render(<ChessScene />);
      const camera = screen.getByTestId('perspective-camera');
      const position = JSON.parse(camera.getAttribute('data-position')!);
      expect(position).toEqual([CAMERA.whitePosition.x, CAMERA.whitePosition.y, CAMERA.whitePosition.z]);
    });

    it('uses spectator position for spectators', () => {
      useGameStore.setState({ playerRole: 'spectator', isOnline: true });
      render(<ChessScene />);
      const camera = screen.getByTestId('perspective-camera');
      const position = JSON.parse(camera.getAttribute('data-position')!);
      expect(position).toEqual([CAMERA.spectatorPosition.x, CAMERA.spectatorPosition.y, CAMERA.spectatorPosition.z]);
    });
  });

  describe('orbit controls by player role', () => {
    it('disables pan for players', () => {
      useGameStore.setState({ playerRole: 'player', isOnline: true });
      render(<ChessScene />);
      const controls = screen.getByTestId('orbit-controls');
      expect(controls.getAttribute('data-enable-pan')).toBe('false');
    });

    it('enables pan for spectators', () => {
      useGameStore.setState({ playerRole: 'spectator', isOnline: true });
      render(<ChessScene />);
      const controls = screen.getByTestId('orbit-controls');
      expect(controls.getAttribute('data-enable-pan')).toBe('true');
    });

    it('allows wider zoom range for spectators', () => {
      useGameStore.setState({ playerRole: 'spectator', isOnline: true });
      render(<ChessScene />);
      const controls = screen.getByTestId('orbit-controls');
      expect(Number(controls.getAttribute('data-max-distance'))).toBe(22);
      expect(Number(controls.getAttribute('data-min-distance'))).toBe(3);
    });

    it('restricts zoom range for players', () => {
      useGameStore.setState({ playerRole: 'player', isOnline: true });
      render(<ChessScene />);
      const controls = screen.getByTestId('orbit-controls');
      expect(Number(controls.getAttribute('data-max-distance'))).toBe(15);
      expect(Number(controls.getAttribute('data-min-distance'))).toBe(5);
    });
  });
});
