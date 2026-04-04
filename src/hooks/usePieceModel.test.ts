import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const { mockScene, mockAnimations, mockUseGLTF, mockPreload } = vi.hoisted(() => {
  const mockScene = {
    clone: vi.fn().mockReturnThis(),
  };
  const mockAnimations = [{ name: 'idle' }, { name: 'capture' }];
  const mockPreload = vi.fn();
  const mockUseGLTF = Object.assign(
    vi.fn().mockReturnValue({
      scene: mockScene,
      animations: mockAnimations,
    }),
    { preload: mockPreload }
  );
  return { mockScene, mockAnimations, mockUseGLTF, mockPreload };
});

vi.mock('@react-three/drei', () => ({
  useGLTF: mockUseGLTF,
}));

import { usePieceModel } from './usePieceModel';

describe('usePieceModel', () => {
  it('returns scene, animations, and isLoaded', () => {
    const { result } = renderHook(() => usePieceModel('p', 'w'));
    expect(result.current).toHaveProperty('scene');
    expect(result.current).toHaveProperty('animations');
    expect(result.current).toHaveProperty('isLoaded');
  });

  it('returns isLoaded=true when useGLTF succeeds', () => {
    const { result } = renderHook(() => usePieceModel('p', 'w'));
    expect(result.current.isLoaded).toBe(true);
  });

  it('returns the animations from the GLTF', () => {
    const { result } = renderHook(() => usePieceModel('p', 'w'));
    expect(result.current.animations).toEqual(mockAnimations);
  });

  it('clones the scene to avoid shared geometry', () => {
    mockScene.clone.mockClear();
    renderHook(() => usePieceModel('r', 'b'));
    expect(mockScene.clone).toHaveBeenCalled();
  });

  it('loads from the correct MODEL_MANIFEST path', () => {
    mockUseGLTF.mockClear();
    renderHook(() => usePieceModel('q', 'w'));
    expect(mockUseGLTF).toHaveBeenCalledWith('/assets/models/queen_white.glb');
  });

  it('preload is called for all 12 models', () => {
    expect(mockPreload).toHaveBeenCalledTimes(12);
  });
});
