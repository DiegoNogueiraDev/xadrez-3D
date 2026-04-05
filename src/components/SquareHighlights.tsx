import { useGameStore } from '../stores/useGameStore';
import { HIGHLIGHT_COLORS, HIGHLIGHT_CONFIG } from '../lib/highlightConfig';
import { SQUARE_SIZE, BOARD_OFFSET } from '../utils/constants';

function squareToPosition(square: string): [number, number, number] {
  const file = square.charCodeAt(0) - 97; // 'a' = 0
  const rank = parseInt(square[1]) - 1;
  const x = file * SQUARE_SIZE - BOARD_OFFSET;
  const z = (7 - rank) * SQUARE_SIZE - BOARD_OFFSET;
  return [x, HIGHLIGHT_CONFIG.yOffset, z];
}

function HighlightPlane({ square, color }: { square: string; color: string }) {
  const pos = squareToPosition(square);
  return (
    <mesh position={pos} rotation={[-Math.PI / 2, 0, 0]} name={`highlight-${square}`} raycast={() => {}}>
      <planeGeometry args={[SQUARE_SIZE * 0.9, SQUARE_SIZE * 0.9]} />
      <meshBasicMaterial color={color} transparent opacity={HIGHLIGHT_CONFIG.opacity} depthWrite={false} />
    </mesh>
  );
}

export default function SquareHighlights() {
  const selectedSquare = useGameStore((s) => s.selectedSquare);
  const legalMoves = useGameStore((s) => s.legalMoves);
  const isCheck = useGameStore((s) => s.isCheck);

  return (
    <group name="highlights">
      {selectedSquare && (
        <HighlightPlane square={selectedSquare} color={HIGHLIGHT_COLORS.selected} />
      )}
      {legalMoves.map((sq) => (
        <HighlightPlane key={sq} square={sq} color={HIGHLIGHT_COLORS.legalMove} />
      ))}
      {isCheck && selectedSquare && (
        <HighlightPlane square={selectedSquare} color={HIGHLIGHT_COLORS.check} />
      )}
    </group>
  );
}
