import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const { mockUseAnimations, mockActions } = vi.hoisted(() => {
  const createMockAction = () => ({
    play: vi.fn(),
    stop: vi.fn(),
    reset: vi.fn().mockReturnThis(),
    setLoop: vi.fn(),
    clampWhenFinished: false,
  });

  const mockActions = {
    Pawn_idle: createMockAction(),
    Pawn_capture: createMockAction(),
    Pawn_promote: createMockAction(),
  };

  const mockUseAnimations = vi.fn().mockReturnValue({ actions: mockActions });
  return { mockUseAnimations, mockActions };
});

vi.mock('@react-three/drei', () => ({
  useAnimations: mockUseAnimations,
}));

import { usePieceAnimationController } from './usePieceAnimationController';

describe('usePieceAnimationController', () => {
  const mockAnimations = [
    { name: 'Pawn_idle' },
    { name: 'Pawn_capture' },
    { name: 'Pawn_promote' },
  ] as any[];
  const mockRef = { current: {} } as any;

  it('returns playIdle, playCapture, playPromote functions', () => {
    const { result } = renderHook(() =>
      usePieceAnimationController(mockAnimations, mockRef, 'Pawn')
    );
    expect(typeof result.current.playIdle).toBe('function');
    expect(typeof result.current.playCapture).toBe('function');
    expect(typeof result.current.playPromote).toBe('function');
  });

  it('playIdle calls reset and play on the idle action', () => {
    const { result } = renderHook(() =>
      usePieceAnimationController(mockAnimations, mockRef, 'Pawn')
    );
    result.current.playIdle();
    expect(mockActions.Pawn_idle.reset).toHaveBeenCalled();
    expect(mockActions.Pawn_idle.play).toHaveBeenCalled();
  });

  it('playCapture calls reset and play on the capture action', () => {
    const { result } = renderHook(() =>
      usePieceAnimationController(mockAnimations, mockRef, 'Pawn')
    );
    result.current.playCapture();
    expect(mockActions.Pawn_capture.reset).toHaveBeenCalled();
    expect(mockActions.Pawn_capture.play).toHaveBeenCalled();
  });

  it('playPromote calls reset and play on the promote action', () => {
    const { result } = renderHook(() =>
      usePieceAnimationController(mockAnimations, mockRef, 'Pawn')
    );
    result.current.playPromote();
    expect(mockActions.Pawn_promote.reset).toHaveBeenCalled();
    expect(mockActions.Pawn_promote.play).toHaveBeenCalled();
  });

  it('handles empty animations array gracefully', () => {
    mockUseAnimations.mockReturnValueOnce({ actions: {} });
    const { result } = renderHook(() =>
      usePieceAnimationController([], mockRef, 'Pawn')
    );
    expect(() => result.current.playIdle()).not.toThrow();
    expect(() => result.current.playCapture()).not.toThrow();
    expect(() => result.current.playPromote()).not.toThrow();
  });

  it('passes animations and ref to useAnimations', () => {
    mockUseAnimations.mockClear();
    renderHook(() =>
      usePieceAnimationController(mockAnimations, mockRef, 'Pawn')
    );
    expect(mockUseAnimations).toHaveBeenCalledWith(mockAnimations, mockRef);
  });
});
