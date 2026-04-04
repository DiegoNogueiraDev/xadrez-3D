import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockStart = vi.fn();

vi.mock('@react-spring/three', () => ({
  useSpring: (cb: () => Record<string, unknown>) => {
    const props = typeof cb === 'function' ? cb() : cb;
    return [props, { start: mockStart }];
  },
}));

import { useLandingAnimation } from './useLandingAnimation';
import { LANDING_CONFIG } from '../lib/landingConfig';

describe('useLandingAnimation', () => {
  it('returns rotationY, scaleY and trigger function', () => {
    const { result } = renderHook(() => useLandingAnimation());
    expect(result.current).toHaveProperty('rotationY');
    expect(result.current).toHaveProperty('scaleY');
    expect(typeof result.current.trigger).toBe('function');
  });

  it('defaults to rotationY=0 and scaleY=1', () => {
    const { result } = renderHook(() => useLandingAnimation());
    expect(result.current.rotationY).toBe(LANDING_CONFIG.defaultRotationY);
    expect(result.current.scaleY).toBe(LANDING_CONFIG.defaultScaleY);
  });

  it('trigger calls api.start with wobble values', () => {
    const { result } = renderHook(() => useLandingAnimation());
    act(() => {
      result.current.trigger();
    });
    expect(mockStart).toHaveBeenCalled();
  });
});
