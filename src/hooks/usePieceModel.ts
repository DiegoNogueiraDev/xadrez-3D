import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { PieceSymbol, Color } from 'chess.js';
import { getModelPath, MODEL_MANIFEST } from '../lib/modelManifest';

function normalizeScene(scene: THREE.Group): THREE.Group {
  const clone = scene.clone();

  // Fix nodes with zero scale (common in AI-generated GLTF models)
  clone.traverse((node) => {
    if (node.scale.x === 0 || node.scale.y === 0 || node.scale.z === 0) {
      node.scale.set(1, 1, 1);
    }
  });

  // Center geometry at origin and normalize size
  const box = new THREE.Box3().setFromObject(clone);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Only normalize if we have actual geometry (size > 0)
  if (size.length() > 0) {
    // Center horizontally, keep bottom at y=0
    clone.position.sub(new THREE.Vector3(center.x, box.min.y, center.z));
  }

  return clone;
}

export function usePieceModel(type: PieceSymbol, color: Color) {
  const path = getModelPath(type, color);
  const { scene, animations } = useGLTF(path);

  const normalizedScene = useMemo(() => normalizeScene(scene), [scene]);

  return {
    scene: normalizedScene,
    animations,
    isLoaded: true,
  };
}

// Preload all models on module initialization
for (const entry of Object.values(MODEL_MANIFEST)) {
  useGLTF.preload(entry.path);
}
