import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { disposeScene, disposeMaterial } from './disposeScene';

describe('disposeMaterial', () => {
  it('disposes a single material and its textures', () => {
    const mapDispose = vi.fn();
    const normalDispose = vi.fn();
    const matDispose = vi.fn();

    const material = {
      map: { dispose: mapDispose },
      normalMap: { dispose: normalDispose },
      roughnessMap: null,
      dispose: matDispose,
    } as unknown as THREE.MeshStandardMaterial;

    disposeMaterial(material);

    expect(mapDispose).toHaveBeenCalled();
    expect(normalDispose).toHaveBeenCalled();
    expect(matDispose).toHaveBeenCalled();
  });

  it('handles material arrays', () => {
    const dispose1 = vi.fn();
    const dispose2 = vi.fn();
    const materials = [
      { dispose: dispose1 } as unknown as THREE.Material,
      { dispose: dispose2 } as unknown as THREE.Material,
    ];

    disposeMaterial(materials);

    expect(dispose1).toHaveBeenCalled();
    expect(dispose2).toHaveBeenCalled();
  });

  it('handles null/undefined gracefully', () => {
    expect(() => disposeMaterial(null as unknown as THREE.Material)).not.toThrow();
    expect(() => disposeMaterial(undefined as unknown as THREE.Material)).not.toThrow();
  });
});

describe('disposeScene', () => {
  it('disposes geometry and material of mesh children', () => {
    const geoDispose = vi.fn();
    const matDispose = vi.fn();

    const scene = new THREE.Group();
    const mesh = new THREE.Mesh();
    mesh.geometry = { dispose: geoDispose } as unknown as THREE.BufferGeometry;
    mesh.material = { dispose: matDispose } as unknown as THREE.Material;
    scene.add(mesh);

    disposeScene(scene);

    expect(geoDispose).toHaveBeenCalled();
    expect(matDispose).toHaveBeenCalled();
  });

  it('traverses nested groups', () => {
    const geoDispose = vi.fn();
    const matDispose = vi.fn();

    const scene = new THREE.Group();
    const group = new THREE.Group();
    const mesh = new THREE.Mesh();
    mesh.geometry = { dispose: geoDispose } as unknown as THREE.BufferGeometry;
    mesh.material = { dispose: matDispose } as unknown as THREE.Material;
    group.add(mesh);
    scene.add(group);

    disposeScene(scene);

    expect(geoDispose).toHaveBeenCalled();
    expect(matDispose).toHaveBeenCalled();
  });

  it('handles empty scene without throwing', () => {
    const scene = new THREE.Group();
    expect(() => disposeScene(scene)).not.toThrow();
  });
});
