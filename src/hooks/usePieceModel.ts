import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { PieceSymbol, Color } from 'chess.js';
import { getModelPath, MODEL_MANIFEST } from '../lib/modelManifest';

export function usePieceModel(type: PieceSymbol, color: Color) {
  const path = getModelPath(type, color);
  const { scene, animations } = useGLTF(path);

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return {
    scene: clonedScene,
    animations,
    isLoaded: true,
  };
}

// Preload all models on module initialization
for (const entry of Object.values(MODEL_MANIFEST)) {
  useGLTF.preload(entry.path);
}
