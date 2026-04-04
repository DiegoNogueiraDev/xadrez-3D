import { vi } from 'vitest';

export function mockR3F() {
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
    PerspectiveCamera: (props: any) => {
      const React = require('react');
      return React.createElement('div', {
        'data-testid': 'perspective-camera',
        'data-position': JSON.stringify(props.position),
        'data-fov': props.fov,
        'data-makedefault': props.makeDefault,
      });
    },
    Text: ({ children, ...props }: any) => {
      const React = require('react');
      return React.createElement(
        'div',
        { 'data-testid': 'drei-text', 'data-text': children, ...props },
        children,
      );
    },
  }));
}
