import { SQUARE_SIZE, BOARD_OFFSET, PIECE_HEIGHT_OFFSET } from '../utils/constants';
import { useGameStore } from '../stores/useGameStore';
import ChessPiece from './ChessPiece';
import type { PieceSymbol, Color } from 'chess.js';

function InteractivePiece({
  type,
  color,
  position,
  square,
}: {
  type: PieceSymbol;
  color: Color;
  position: [number, number, number];
  square: string;
}) {
  const isSelected = useGameStore((s) => s.selectedSquare === square);

  return (
    <ChessPiece
      type={type}
      color={color}
      position={position}
      square={square}
      isSelected={isSelected}
    />
  );
}

function squareToPosition(square: string): [number, number, number] {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(square[1]) - 1;
  const x = file * SQUARE_SIZE - BOARD_OFFSET;
  const z = (7 - rank) * SQUARE_SIZE - BOARD_OFFSET;
  return [x, PIECE_HEIGHT_OFFSET, z];
}

export default function ChessPieces() {
  const board = useGameStore((s) => s.board);

  const pieces: JSX.Element[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      const square = piece.square;
      const pos = squareToPosition(square);

      pieces.push(
        <InteractivePiece
          key={square}
          type={piece.type}
          color={piece.color}
          position={pos}
          square={square}
        />,
      );
    }
  }

  return <group>{pieces}</group>;
}
