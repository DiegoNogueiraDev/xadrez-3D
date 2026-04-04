import { useRef, Component, type ReactNode } from 'react';
import * as THREE from 'three';
import { animated } from '@react-spring/three';
import { COLORS, PIECE_SCALE } from '../utils/constants';
import type { PieceSymbol, Color } from 'chess.js';
import { usePieceModel } from '../hooks/usePieceModel';
import { useSelectionAnimation } from '../hooks/useSelectionAnimation';
import { SELECTION_CONFIG } from '../lib/selectionConfig';

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

function GLTFPiece({ type, color }: { type: PieceSymbol; color: Color }) {
  const { scene } = usePieceModel(type, color);
  return <primitive object={scene} />;
}

// Error boundary for GLTF loading fallback (C-002 constraint)
class PieceErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
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
  const { scale, emissiveIntensity } = useSelectionAnimation(isSelected);
  const procedural = <ProceduralPiece type={type} color={color} />;

  return (
    <animated.group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      data-testid="chess-piece"
      data-type={type}
      data-color={color}
      data-square={square}
    >
      <PieceErrorBoundary fallback={procedural}>
        <GLTFPiece type={type} color={color} />
      </PieceErrorBoundary>
      {isSelected && (
        <pointLight
          position={[0, 1, 0]}
          intensity={0.5}
          color={SELECTION_CONFIG.emissiveColor}
          distance={2}
        />
      )}
    </animated.group>
  );
}
