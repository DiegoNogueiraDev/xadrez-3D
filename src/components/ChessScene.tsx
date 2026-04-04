import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import ChessBoard from './ChessBoard';
import ChessPieces from './ChessPieces';
import SceneEnvironment from './SceneEnvironment';
import SceneLighting from './SceneLighting';
import TableSurface from './TableSurface';
import ContactShadowsLayer from './ContactShadowsLayer';
import SquareHighlights from './SquareHighlights';
import PostProcessingEffects from './PostProcessingEffects';
import { useGameStore } from '../stores/useGameStore';
import { CAMERA } from '../utils/constants';

export default function ChessScene() {
  const playerColor = useGameStore((s) => s.playerColor);
  const playerRole = useGameStore((s) => s.playerRole);
  const isOnline = useGameStore((s) => s.isOnline);

  const isSpectator = playerRole === 'spectator';

  const cameraPosition = useMemo((): [number, number, number] => {
    if (isSpectator) {
      const p = CAMERA.spectatorPosition;
      return [p.x, p.y, p.z];
    }
    if (isOnline && playerColor === 'b') {
      const p = CAMERA.blackPosition;
      return [p.x, p.y, p.z];
    }
    const p = CAMERA.whitePosition;
    return [p.x, p.y, p.z];
  }, [playerColor, playerRole, isOnline, isSpectator]);

  return (
    <Canvas shadows>
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={50}
      />
      <OrbitControls
        enablePan={isSpectator}
        minPolarAngle={isSpectator ? Math.PI / 16 : Math.PI / 6}
        maxPolarAngle={isSpectator ? Math.PI / 2 : Math.PI / 2.5}
        minDistance={isSpectator ? 3 : 5}
        maxDistance={isSpectator ? 22 : 15}
      />
      <SceneLighting />
      <SceneEnvironment />
      <TableSurface />
      <ChessBoard />
      <SquareHighlights />
      <ChessPieces />
      <ContactShadowsLayer />
      <PostProcessingEffects />
    </Canvas>
  );
}
