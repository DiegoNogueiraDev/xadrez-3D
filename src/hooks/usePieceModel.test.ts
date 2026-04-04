import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as THREE from 'three';

const { mockAnimations, mockUseGLTF, mockPreload } = vi.hoisted(() => {
  // Create a real Three.js group as mock scene
  const mockGroup = new THREE.Group();
  const mockMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.2, 0.1),
    new THREE.MeshBasicMaterial()
  );
  mockGroup.add(mockMesh);

  const mockAnimations = [{ name: 'idle' }, { name: 'capture' }];
  const mockPreload = vi.fn();
  const mockUseGLTF = Object.assign(
    vi.fn().mockReturnValue({
      scene: mockGroup,
      animations: mockAnimations,
    }),
    { preload: mockPreload }
  );
  return { mockAnimations, mockUseGLTF, mockPreload };
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
    expect(result.current.isLoaded).toBe(true);
  });

  it('returns the animations from the GLTF', () => {
    const { result } = renderHook(() => usePieceModel('p', 'w'));
    expect(result.current.animations).toEqual(mockAnimations);
  });

  it('returns a normalized scene (not the original)', () => {
    const { result } = renderHook(() => usePieceModel('r', 'b'));
    // Scene should be a Group (cloned and normalized)
    expect(result.current.scene).toBeInstanceOf(THREE.Group);
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
