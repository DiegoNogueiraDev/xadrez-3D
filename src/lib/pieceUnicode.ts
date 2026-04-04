import type { PieceSymbol, Color } from 'chess.js';

export const PIECE_UNICODE: Record<string, string> = {
  'k-w': '♔', 'q-w': '♕', 'r-w': '♖', 'b-w': '♗', 'n-w': '♘', 'p-w': '♙',
  'k-b': '♚', 'q-b': '♛', 'r-b': '♜', 'b-b': '♝', 'n-b': '♞', 'p-b': '♟',
};

export function getPieceUnicode(type: PieceSymbol, color: Color): string {
  return PIECE_UNICODE[`${type}-${color}`] ?? '?';
}
