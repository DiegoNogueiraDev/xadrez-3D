import * as THREE from 'three';

const TEXTURE_KEYS = [
  'map', 'normalMap', 'roughnessMap', 'metalnessMap',
  'aoMap', 'emissiveMap', 'displacementMap', 'alphaMap',
  'envMap', 'lightMap', 'bumpMap',
] as const;

export function disposeMaterial(
  material: THREE.Material | THREE.Material[] | null | undefined
): void {
  if (!material) return;

  const materials = Array.isArray(material) ? material : [material];

  for (const mat of materials) {
    // Dispose texture maps
    for (const key of TEXTURE_KEYS) {
      const texture = (mat as unknown as Record<string, unknown>)[key];
      if (texture && typeof (texture as THREE.Texture).dispose === 'function') {
        (texture as THREE.Texture).dispose();
      }
    }
    mat.dispose();
  }
}

export function disposeScene(scene: THREE.Object3D): void {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      if (object.geometry) {
        object.geometry.dispose();
      }
      disposeMaterial(object.material);
    }
  });
}
