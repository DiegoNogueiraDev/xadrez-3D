import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as THREE from 'three';

const { mockUseGLTF, mockPreload } = vi.hoisted(() => {
  const mockPreload = vi.fn();
  const mockUseGLTF = Object.assign(
    vi.fn(),
    { preload: mockPreload }
  );
  return { mockUseGLTF, mockPreload };
});

vi.mock('@react-three/drei', () => ({
  useGLTF: mockUseGLTF,
}));

import { usePieceModel } from './usePieceModel';

// Set implementation after imports (THREE is available here)
function createMockScene() {
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.2, 0.1),
    new THREE.MeshBasicMaterial()
  );
  group.add(mesh);
  return group;
}

mockUseGLTF.mockImplementation(() => ({
  scene: createMockScene(),
  animations: [{ name: 'idle' }],
}));

describe('usePieceModel', () => {
  it('returns scene, animations, and isLoaded', () => {
    const { result } = renderHook(() => usePieceModel('p', 'w'));
    expect(result.current.scene).toBeDefined();
    expect(result.current.animations).toBeDefined();
    expect(result.current.isLoaded).toBe(true);
  });

  it('returns a THREE.Group scene', () => {
    const { result } = renderHook(() => usePieceModel('r', 'b'));
    expect(result.current.scene).toBeInstanceOf(THREE.Group);
  });

  it('loads from the correct path', () => {
    mockUseGLTF.mockClear();
    mockUseGLTF.mockImplementation(() => ({
      scene: createMockScene(),
      animations: [],
    }));
    renderHook(() => usePieceModel('q', 'w'));
    expect(mockUseGLTF).toHaveBeenCalledWith('/assets/models/queen_white.glb');
  });

  it('preloads all 12 models', () => {
    expect(mockPreload).toHaveBeenCalledTimes(12);
  });

  it('disables raycast on mesh nodes to prevent click interception', () => {
    const { result } = renderHook(() => usePieceModel('n', 'w'));
    const scene = result.current.scene;

    // All mesh children should have raycast disabled (no-op)
    scene.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Mesh).isMesh) {
        const raycaster = new THREE.Raycaster();
        const intersections: THREE.Intersection[] = [];
        node.raycast(raycaster, intersections);
        expect(intersections).toHaveLength(0);
      }
    });
  });
});
