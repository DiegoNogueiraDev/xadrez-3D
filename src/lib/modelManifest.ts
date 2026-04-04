import type { PieceSymbol, Color } from 'chess.js';

export type ModelKey = `${PieceSymbol}-${Color}`;

export interface ModelEntry {
  path: string;
  label: string;
}

const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: 'pawn',
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  q: 'queen',
  k: 'king',
};

const COLOR_NAMES: Record<Color, string> = {
  w: 'white',
  b: 'black',
};

const PIECE_LABELS: Record<PieceSymbol, string> = {
  p: 'Pawn',
  r: 'Rook',
  n: 'Knight',
  b: 'Bishop',
  q: 'Queen',
  k: 'King',
};

function buildManifest(): Record<ModelKey, ModelEntry> {
  const manifest = {} as Record<ModelKey, ModelEntry>;
  const types: PieceSymbol[] = ['p', 'r', 'n', 'b', 'q', 'k'];
  const colors: Color[] = ['w', 'b'];

  for (const type of types) {
    for (const color of colors) {
      const key: ModelKey = `${type}-${color}`;
      const colorLabel = color === 'w' ? 'White' : 'Black';
      manifest[key] = {
        path: `/assets/models/${PIECE_NAMES[type]}_${COLOR_NAMES[color]}.glb`,
        label: `${PIECE_LABELS[type]} ${colorLabel}`,
      };
    }
  }

  return manifest;
}

export const MODEL_MANIFEST = buildManifest();

export function getModelPath(type: PieceSymbol, color: Color): string {
  const key: ModelKey = `${type}-${color}`;
  return MODEL_MANIFEST[key].path;
}
