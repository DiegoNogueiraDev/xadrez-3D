import { SQUARE_SIZE, COLORS, BOARD_OFFSET } from '../utils/constants';
import { useSquareInteraction } from '../hooks/useSquareInteraction';

interface BoardSquareProps {
  file: number;
  rank: number;
}

export default function BoardSquare({ file, rank }: BoardSquareProps) {
  const isLight = (file + rank) % 2 === 0;
  const color = isLight ? COLORS.lightSquare : COLORS.darkSquare;
  const x = file * SQUARE_SIZE - BOARD_OFFSET;
  const z = (7 - rank) * SQUARE_SIZE - BOARD_OFFSET;
  const squareName = String.fromCharCode('a'.charCodeAt(0) + file) + (rank + 1);
  const { onClick, onPointerOver, onPointerOut } = useSquareInteraction(squareName);

  return (
    <mesh
      position={[x, -0.05, z]}
      receiveShadow
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      name={`square-${squareName}-${isLight ? 'light' : 'dark'}`}
    >
      <boxGeometry args={[SQUARE_SIZE, 0.1, SQUARE_SIZE]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
    </mesh>
  );
}
