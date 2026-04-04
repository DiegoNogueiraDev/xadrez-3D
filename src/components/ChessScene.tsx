import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import ChessBoard from './ChessBoard';
import ChessPieces from './ChessPieces';

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
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <ChessBoard />
      <ChessPieces />
    </Canvas>
  );
}
