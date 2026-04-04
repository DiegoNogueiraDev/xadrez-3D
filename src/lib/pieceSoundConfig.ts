import type { PieceSymbol } from 'chess.js';
import type { PlayOptions } from './sounds';

export interface PieceSoundDescriptor {
  label: string;
  rate: number;
  volume: number;
}

export const PIECE_SOUND_CONFIG: Record<PieceSymbol, PieceSoundDescriptor> = {
  p: { label: 'Pawn (light)', rate: 1.1, volume: 0.6 },
  r: { label: 'Rook (stone drag)', rate: 0.8, volume: 0.9 },
  n: { label: 'Knight (gallop)', rate: 1.3, volume: 0.8 },
  b: { label: 'Bishop (smooth slide)', rate: 1.1, volume: 0.7 },
  q: { label: 'Queen (majestic)', rate: 1.0, volume: 0.95 },
  k: { label: 'King (heavy)', rate: 0.7, volume: 0.95 },
};

export function getPieceSoundOptions(type: PieceSymbol): PlayOptions {
  const { rate, volume } = PIECE_SOUND_CONFIG[type];
  return { rate, volume };
}
