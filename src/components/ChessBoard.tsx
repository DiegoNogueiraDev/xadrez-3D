import { Text } from '@react-three/drei';
import { BOARD_SIZE, SQUARE_SIZE, COLORS, BOARD_OFFSET } from '../utils/constants';
import BoardSquare from './BoardSquare';

export default function ChessBoard() {
  const squares: JSX.Element[] = [];

  for (let file = 0; file < BOARD_SIZE; file++) {
    for (let rank = 0; rank < BOARD_SIZE; rank++) {
      squares.push(<BoardSquare key={`${file}-${rank}`} file={file} rank={rank} />);
    }
  }

  const borderThickness = 0.3;
  const boardWidth = BOARD_SIZE * SQUARE_SIZE;
  const totalWidth = boardWidth + borderThickness * 2;

  const fileLabels = 'abcdefgh'.split('');
  const rankLabels = '12345678'.split('');

  return (
    <group>
      {/* Squares */}
      {squares}

      {/* Border */}
      <mesh
        position={[0, -0.11, 0]}
        receiveShadow
        name="board-border"
      >
        <boxGeometry args={[totalWidth, 0.1, totalWidth]} />
        <meshStandardMaterial color={COLORS.boardBorder} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* File labels (a-h) */}
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

      {/* Rank labels (1-8) */}
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
