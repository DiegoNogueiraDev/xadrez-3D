import { SQUARE_SIZE, BOARD_OFFSET, PIECE_HEIGHT_OFFSET } from '../utils/constants';
import { useGameStore } from '../stores/useGameStore';
import ChessPiece from './ChessPiece';

function squareToPosition(square: string): [number, number, number] {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(square[1]) - 1;
  const x = file * SQUARE_SIZE - BOARD_OFFSET;
  const z = (7 - rank) * SQUARE_SIZE - BOARD_OFFSET;
  return [x, PIECE_HEIGHT_OFFSET, z];
}

export default function ChessPieces() {
  const board = useGameStore((s) => s.board);
  const selectedSquare = useGameStore((s) => s.selectedSquare);

  const pieces: JSX.Element[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      const square = piece.square;
      const pos = squareToPosition(square);

      pieces.push(
        <ChessPiece
          key={square}
          type={piece.type}
          color={piece.color}
          position={pos}
          square={square}
          isSelected={selectedSquare === square}
        />,
      );
    }
  }

  return <group>{pieces}</group>;
}
