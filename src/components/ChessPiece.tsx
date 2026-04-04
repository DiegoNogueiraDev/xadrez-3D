import { useRef } from 'react';
import * as THREE from 'three';
import { COLORS, PIECE_SCALE } from '../utils/constants';
import type { PieceSymbol, Color } from 'chess.js';

interface ChessPieceProps {
  type: PieceSymbol;
  color: Color;
  position: [number, number, number];
  square: string;
  isSelected?: boolean;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

const PIECE_GLB_MAP: Record<string, string> = {
  'p-w': '/assets/models/pawn_white.glb',
  'r-w': '/assets/models/rook_white.glb',
  'n-w': '/assets/models/knight_white.glb',
  'b-w': '/assets/models/bishop_white.glb',
  'q-w': '/assets/models/queen_white.glb',
  'k-w': '/assets/models/king_white.glb',
  'p-b': '/assets/models/pawn_black.glb',
  'r-b': '/assets/models/rook_black.glb',
  'n-b': '/assets/models/knight_black.glb',
  'b-b': '/assets/models/bishop_black.glb',
  'q-b': '/assets/models/queen_black.glb',
  'k-b': '/assets/models/king_black.glb',
};

// Height scales for procedural fallback per piece type
const PIECE_HEIGHTS: Record<PieceSymbol, number> = {
  p: 0.6,
  r: 0.7,
  n: 0.8,
  b: 0.85,
  q: 0.95,
  k: 1.0,
};

function ProceduralPiece({ type, color }: { type: PieceSymbol; color: Color }) {
  const pieceColor = color === 'w' ? COLORS.whitePiece : COLORS.blackPiece;
  const height = PIECE_HEIGHTS[type];

  return (
    <group scale={[PIECE_SCALE, PIECE_SCALE, PIECE_SCALE]}>
      {/* Base */}
      <mesh position={[0, 0.075, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.15, 16]} />
        <meshStandardMaterial color={pieceColor} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Body */}
      <mesh position={[0, height / 2 + 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, height, 16]} />
        <meshStandardMaterial color={pieceColor} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Top sphere */}
      <mesh position={[0, height + 0.2, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={pieceColor} roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  );
}

export default function ChessPiece({
  type,
  color,
  position,
  square,
  isSelected = false,
  onClick,
  onPointerOver,
  onPointerOut,
}: ChessPieceProps) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      data-testid="chess-piece"
      data-type={type}
      data-color={color}
      data-square={square}
    >
      <ProceduralPiece type={type} color={color} />
      {isSelected && (
        <pointLight position={[0, 1, 0]} intensity={0.5} color="#ffff00" distance={2} />
      )}
    </group>
  );
}
