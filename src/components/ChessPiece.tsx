import { useRef, Suspense, Component, type ReactNode } from 'react';
import * as THREE from 'three';
import { animated } from '@react-spring/three';
import { PIECE_SCALE } from '../utils/constants';
import type { PieceSymbol, Color } from 'chess.js';
import { usePieceModel } from '../hooks/usePieceModel';
import { useSelectionAnimation } from '../hooks/useSelectionAnimation';
import { SELECTION_CONFIG } from '../lib/selectionConfig';
import { getPieceMaterial } from '../lib/pieceMaterials';

interface ChessPieceProps {
  type: PieceSymbol;
  color: Color;
  position: [number, number, number];
  square: string;
  isSelected?: boolean;
}

const PIECE_HEIGHTS: Record<PieceSymbol, number> = {
  p: 0.6,
  r: 0.7,
  n: 0.8,
  b: 0.85,
  q: 0.95,
  k: 1.0,
};

function ProceduralPiece({ type, color }: { type: PieceSymbol; color: Color }) {
  const mat = getPieceMaterial(color);
  const height = PIECE_HEIGHTS[type];

  return (
    <group scale={[PIECE_SCALE, PIECE_SCALE, PIECE_SCALE]}>
      <mesh position={[0, 0.075, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.15, 16]} />
        <meshPhysicalMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
          clearcoat={mat.clearcoat}
          clearcoatRoughness={mat.clearcoatRoughness}
        />
      </mesh>
      <mesh position={[0, height / 2 + 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, height, 16]} />
        <meshPhysicalMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
          clearcoat={mat.clearcoat}
          clearcoatRoughness={mat.clearcoatRoughness}
        />
      </mesh>
      <mesh position={[0, height + 0.2, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhysicalMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
          clearcoat={mat.clearcoat}
          clearcoatRoughness={mat.clearcoatRoughness}
        />
      </mesh>
    </group>
  );
}

const GLTF_SCALE = 5;

function GLTFPiece({ type, color }: { type: PieceSymbol; color: Color }) {
  const { scene } = usePieceModel(type, color);
  return (
    <group scale={[GLTF_SCALE, GLTF_SCALE, GLTF_SCALE]}>
      <primitive object={scene} />
    </group>
  );
}

class PieceErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode; pieceName?: string },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.warn(`[ChessPiece] GLTF load failed for ${this.props.pieceName}, using procedural fallback:`, error.message);
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
}: ChessPieceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scale } = useSelectionAnimation(isSelected);
  const procedural = <ProceduralPiece type={type} color={color} />;
  const pieceName = `${type}-${color}-${square}`;

  return (
    <animated.group
      ref={groupRef}
      position={position}
      scale={scale}
      name={`piece-${pieceName}`}
      raycast={() => {}}
    >
      <PieceErrorBoundary fallback={procedural} pieceName={pieceName}>
        <Suspense fallback={procedural}>
          <GLTFPiece type={type} color={color} />
        </Suspense>
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
