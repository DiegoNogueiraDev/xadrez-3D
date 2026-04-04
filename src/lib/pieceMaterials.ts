import type { Color } from 'chess.js';

export interface PieceMaterialConfig {
  color: string;
  roughness: number;
  metalness: number;
  emissiveColor: string;
  emissiveIntensity: number;
  clearcoat: number;
  clearcoatRoughness: number;
}

export const PIECE_MATERIALS: Record<'white' | 'black', PieceMaterialConfig> = {
  white: {
    color: '#F5F0E8',
    roughness: 0.3,
    metalness: 0.05,
    emissiveColor: '#FFF8E7',
    emissiveIntensity: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  },
  black: {
    color: '#1A1A2E',
    roughness: 0.25,
    metalness: 0.4,
    emissiveColor: '#2A2A4E',
    emissiveIntensity: 0.01,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
  },
};

export function getPieceMaterial(color: Color): PieceMaterialConfig {
  return color === 'w' ? PIECE_MATERIALS.white : PIECE_MATERIALS.black;
}
