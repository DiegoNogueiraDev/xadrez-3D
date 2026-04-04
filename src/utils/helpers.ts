import { BOARD_OFFSET, SQUARE_SIZE } from './constants';

export function chessToWorld(file: number, rank: number): { x: number; z: number } {
  return {
    x: file * SQUARE_SIZE - BOARD_OFFSET,
    z: (7 - rank) * SQUARE_SIZE - BOARD_OFFSET,
  };
}

export function algebraicToFileRank(square: string): { file: number; rank: number } {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(square[1]) - 1;
  return { file, rank };
}

export function algebraicToWorld(square: string): { x: number; z: number } {
  const { file, rank } = algebraicToFileRank(square);
  return chessToWorld(file, rank);
}

export function worldToFileRank(x: number, z: number): { file: number; rank: number } | null {
  const file = Math.round(x + BOARD_OFFSET) / SQUARE_SIZE;
  const rank = 7 - Math.round(z + BOARD_OFFSET) / SQUARE_SIZE;
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
  return { file: Math.round(file), rank: Math.round(rank) };
}

export function fileRankToAlgebraic(file: number, rank: number): string {
  return String.fromCharCode('a'.charCodeAt(0) + file) + (rank + 1);
}

export function generateGameId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
