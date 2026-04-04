import { SQUARE_SIZE, BOARD_OFFSET } from '../utils/constants';
import { useSquareInteraction } from '../hooks/useSquareInteraction';

interface BoardSquareProps {
  file: number;
  rank: number;
}

export default function BoardSquare({ file, rank }: BoardSquareProps) {
  const isLight = (file + rank) % 2 === 0;
  const x = file * SQUARE_SIZE - BOARD_OFFSET;
  const z = (7 - rank) * SQUARE_SIZE - BOARD_OFFSET;
  const squareName = String.fromCharCode('a'.charCodeAt(0) + file) + (rank + 1);
  const { onClick, onPointerOver, onPointerOut } = useSquareInteraction(squareName);

  return (
    <mesh
      position={[x, 0.02, z]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      name={`square-${squareName}-${isLight ? 'light' : 'dark'}`}
    >
      <boxGeometry args={[SQUARE_SIZE, 0.05, SQUARE_SIZE]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
