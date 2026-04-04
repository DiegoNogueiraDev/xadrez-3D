import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@react-three/fiber', async () => {
  const actual = await vi.importActual('@react-three/fiber');
  return {
    ...actual,
    Canvas: ({ children }: { children: React.ReactNode }) => {
      const React = require('react');
      return React.createElement('div', { 'data-testid': 'r3f-canvas' }, children);
    },
  };
});

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  PerspectiveCamera: () => null,
  Environment: (props: any) => {
    const React = require('react');
    return React.createElement('div', {
      'data-testid': 'drei-environment',
      'data-files': props.files,
      'data-background': String(props.background),
    });
  },
}));

import SceneEnvironment from './SceneEnvironment';
import { ENVIRONMENT_CONFIG } from '../lib/environment';

describe('SceneEnvironment', () => {
  it('renders without crashing', () => {
    const { container } = render(<SceneEnvironment />);
    expect(container).toBeTruthy();
  });

  it('renders drei Environment component', () => {
    const { getByTestId } = render(<SceneEnvironment />);
    expect(getByTestId('drei-environment')).toBeTruthy();
  });

  it('passes ENVIRONMENT_CONFIG.path as files prop', () => {
    const { getByTestId } = render(<SceneEnvironment />);
    const env = getByTestId('drei-environment');
    expect(env.getAttribute('data-files')).toBe(ENVIRONMENT_CONFIG.path);
  });

  it('sets background={true} for medieval atmosphere', () => {
    const { getByTestId } = render(<SceneEnvironment />);
    const env = getByTestId('drei-environment');
    expect(env.getAttribute('data-background')).toBe('true');
  });

  it('uses the correct medieval HDRI path from config', () => {
    const { getByTestId } = render(<SceneEnvironment />);
    const env = getByTestId('drei-environment');
    expect(env.getAttribute('data-files')).toBe('/assets/environment/medieval.hdr');
  });
});
