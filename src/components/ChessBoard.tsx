import React, { Suspense, useMemo } from 'react';
import { Text, useGLTF } from '@react-three/drei';
import { BOARD_SIZE, SQUARE_SIZE, BOARD_OFFSET } from '../utils/constants';
import BoardSquare from './BoardSquare';

function GLTFBoard() {
  const { scene } = useGLTF('/assets/models/board.glb');
  const cloned = useMemo(() => {
    const c = scene.clone();
    // Fix zero-scale nodes (same issue as pieces)
    c.traverse((node) => {
      if (node.scale.x === 0 || node.scale.y === 0 || node.scale.z === 0) {
        node.scale.set(1, 1, 1);
      }
      // Disable raycast on board model so clicks pass through to interaction squares
      node.raycast = () => {};
    });
    return c;
  }, [scene]);

  return (
    <group position={[0, -0.06, 0]}>
      <primitive object={cloned} />
    </group>
  );
}

// Invisible interaction squares for raycasting (click detection)
function InteractionSquares() {
  const squares: React.JSX.Element[] = [];
  for (let file = 0; file < BOARD_SIZE; file++) {
    for (let rank = 0; rank < BOARD_SIZE; rank++) {
      squares.push(<BoardSquare key={`${file}-${rank}`} file={file} rank={rank} />);
    }
  }
  return <group>{squares}</group>;
}

function CoordinateLabels() {
  const fileLabels = 'abcdefgh'.split('');
  const rankLabels = '12345678'.split('');

  return (
    <group>
      {fileLabels.map((label, i) => (
        <Text
          key={`file-${label}`}
          position={[i * SQUARE_SIZE - BOARD_OFFSET, -0.05, BOARD_OFFSET + 0.7]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      ))}
      {rankLabels.map((label, i) => (
        <Text
          key={`rank-${label}`}
          position={[-BOARD_OFFSET - 0.7, -0.05, (7 - i) * SQUARE_SIZE - BOARD_OFFSET]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

// Procedural fallback board (simple colored squares)
function ProceduralBoard() {
  const squares: React.JSX.Element[] = [];
  for (let file = 0; file < BOARD_SIZE; file++) {
    for (let rank = 0; rank < BOARD_SIZE; rank++) {
      squares.push(<BoardSquare key={`${file}-${rank}`} file={file} rank={rank} />);
    }
  }

  const boardWidth = BOARD_SIZE * SQUARE_SIZE;
  const totalWidth = boardWidth + 0.6;

  return (
    <group>
      {squares}
      <mesh position={[0, -0.11, 0]} receiveShadow name="board-border">
        <boxGeometry args={[totalWidth, 0.1, totalWidth]} />
        <meshStandardMaterial color="#5C3A1E" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}

export default function ChessBoard() {
  return (
    <group>
      <Suspense fallback={<ProceduralBoard />}>
        <GLTFBoard />
        <InteractionSquares />
      </Suspense>
      <CoordinateLabels />
    </group>
  );
}
