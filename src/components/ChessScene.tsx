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

export default function ChessScene() {
  return (
    <Canvas shadows>
      <PerspectiveCamera
        makeDefault
        position={[0, 8, 8]}
        fov={50}
      />
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={5}
        maxDistance={15}
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
