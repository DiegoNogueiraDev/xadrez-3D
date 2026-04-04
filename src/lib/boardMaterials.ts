import { TEXTURE_SETS, type TextureSet } from './textures';

export interface BoardSquareMaterial {
  textureSet: TextureSet;
  roughness: number;
  metalness: number;
  normalScale: number;
}

export const BOARD_MATERIALS: Record<'lightSquare' | 'darkSquare', BoardSquareMaterial> = {
  lightSquare: {
    textureSet: TEXTURE_SETS.marble_light,
    roughness: 0.35,
    metalness: 0.05,
    normalScale: 0.8,
  },
  darkSquare: {
    textureSet: TEXTURE_SETS.marble_dark,
    roughness: 0.3,
    metalness: 0.1,
    normalScale: 1.0,
  },
};

export const BOARD_BORDER: BoardSquareMaterial = {
  textureSet: TEXTURE_SETS.wood,
  roughness: 0.6,
  metalness: 0.0,
  normalScale: 1.2,
};

export function getBoardSquareMaterial(isLight: boolean): BoardSquareMaterial {
  return isLight ? BOARD_MATERIALS.lightSquare : BOARD_MATERIALS.darkSquare;
}
