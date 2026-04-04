import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock @react-spring/three before importing hook
const { mockApiStart } = vi.hoisted(() => {
  const mockApiStart = vi.fn();
  return { mockApiStart };
});

vi.mock('@react-spring/three', () => {
  return {
    useSpring: vi.fn((initFn: () => any) => {
      const initial = typeof initFn === 'function' ? initFn() : initFn;
      const springValue = {
        t: {
          get: () => 1,
          to: (fn: (t: number) => any) => fn(1),
        },
      };
      const api = {
        start: mockApiStart,
      };
      return [springValue, api];
    }),
    animated: {
      group: 'group',
    },
  };
});

import { computeArcPosition, usePieceAnimation } from './usePieceAnimation';

describe('computeArcPosition', () => {
  const from: [number, number, number] = [0, 0, 0];
  const to: [number, number, number] = [4, 0, 4];

  it('returns "from" position at t=0', () => {
    const pos = computeArcPosition(from, to, 0, 2);
    expect(pos).toEqual([0, 0, 0]);
  });

  it('returns "to" position at t=1', () => {
    const pos = computeArcPosition(from, to, 1, 2);
    expect(pos).toEqual([4, 0, 4]);
  });

  it('has parabolic arc peak at t=0.5 (midpoint)', () => {
    const pos = computeArcPosition(from, to, 0.5, 2);
    // X should be midpoint
    expect(pos[0]).toBe(2);
    // Y should be at arc peak: 4 * arcHeight * 0.5 * 0.5 = arcHeight
    expect(pos[1]).toBe(2);
    // Z should be midpoint
    expect(pos[2]).toBe(2);
  });

  it('arc height scales with config', () => {
    const pos = computeArcPosition(from, to, 0.5, 5);
    expect(pos[1]).toBe(5);
  });

  it('interpolates X and Z linearly', () => {
    const pos = computeArcPosition(from, to, 0.25, 2);
    expect(pos[0]).toBe(1);
    expect(pos[2]).toBe(1);
  });

  it('adds arc on top of base Y interpolation', () => {
    const fromWithY: [number, number, number] = [0, 1, 0];
    const toWithY: [number, number, number] = [4, 3, 4];
    const pos = computeArcPosition(fromWithY, toWithY, 0.5, 2);
    // baseY = 1 + (3-1)*0.5 = 2, arcY = 4*2*0.5*0.5 = 2 → total Y = 4
    expect(pos[1]).toBe(4);
  });

  it('returns zero arc at t=0 and t=1', () => {
    const pos0 = computeArcPosition(from, to, 0, 3);
    const pos1 = computeArcPosition(from, to, 1, 3);
    expect(pos0[1]).toBe(0);
    expect(pos1[1]).toBe(0);
  });
});

describe('usePieceAnimation', () => {
  const from: [number, number, number] = [0, 0, 0];
  const to: [number, number, number] = [4, 0, 4];

  beforeEach(() => {
    mockApiStart.mockClear();
  });

  it('returns position, isAnimating, and trigger', () => {
    const { result } = renderHook(() => usePieceAnimation(from, to));
    expect(result.current).toHaveProperty('position');
    expect(result.current).toHaveProperty('isAnimating');
    expect(result.current).toHaveProperty('trigger');
    expect(typeof result.current.trigger).toBe('function');
  });

  it('isAnimating is false by default', () => {
    const { result } = renderHook(() => usePieceAnimation(from, to));
    expect(result.current.isAnimating).toBe(false);
  });

  it('trigger() calls api.start with t: 0→1', () => {
    const { result } = renderHook(() => usePieceAnimation(from, to));
    act(() => {
      result.current.trigger();
    });
    expect(mockApiStart).toHaveBeenCalledTimes(1);
    const startArgs = mockApiStart.mock.calls[0][0];
    expect(startArgs.from).toEqual({ t: 0 });
    expect(startArgs.to).toEqual({ t: 1 });
  });

  it('accepts custom arcHeight and duration config', () => {
    const { result } = renderHook(() =>
      usePieceAnimation(from, to, { arcHeight: 5, duration: 800 })
    );
    act(() => {
      result.current.trigger();
    });
    const startArgs = mockApiStart.mock.calls[0][0];
    expect(startArgs.config.duration).toBe(800);
  });

  it('uses default arcHeight=2 and duration=500', () => {
    const { result } = renderHook(() => usePieceAnimation(from, to));
    act(() => {
      result.current.trigger();
    });
    const startArgs = mockApiStart.mock.calls[0][0];
    expect(startArgs.config.duration).toBe(500);
  });

  it('position resolves to "to" target when t=1 (no animation)', () => {
    const { result } = renderHook(() => usePieceAnimation(from, to));
    // With t=1 (mocked), position should equal "to"
    const pos = result.current.position;
    expect(pos).toEqual([4, 0, 4]);
  });
});
