import { describe, it, expect } from 'vitest';
import { BOARD_MATERIALS, BOARD_BORDER, getBoardSquareMaterial } from './boardMaterials';
import { TEXTURE_SETS } from './textures';

describe('BOARD_MATERIALS', () => {
  describe('lightSquare', () => {
    it('references marble_light texture set', () => {
      expect(BOARD_MATERIALS.lightSquare.textureSet).toBe(TEXTURE_SETS.marble_light);
    });

    it('has roughness between 0 and 1', () => {
      expect(BOARD_MATERIALS.lightSquare.roughness).toBeGreaterThanOrEqual(0);
      expect(BOARD_MATERIALS.lightSquare.roughness).toBeLessThanOrEqual(1);
    });

    it('has metalness between 0 and 1', () => {
      expect(BOARD_MATERIALS.lightSquare.metalness).toBeGreaterThanOrEqual(0);
      expect(BOARD_MATERIALS.lightSquare.metalness).toBeLessThanOrEqual(1);
    });

    it('has normalScale between 0 and 2', () => {
      expect(BOARD_MATERIALS.lightSquare.normalScale).toBeGreaterThanOrEqual(0);
      expect(BOARD_MATERIALS.lightSquare.normalScale).toBeLessThanOrEqual(2);
    });
  });

  describe('darkSquare', () => {
    it('references marble_dark texture set', () => {
      expect(BOARD_MATERIALS.darkSquare.textureSet).toBe(TEXTURE_SETS.marble_dark);
    });

    it('has roughness between 0 and 1', () => {
      expect(BOARD_MATERIALS.darkSquare.roughness).toBeGreaterThanOrEqual(0);
      expect(BOARD_MATERIALS.darkSquare.roughness).toBeLessThanOrEqual(1);
    });

    it('has metalness between 0 and 1', () => {
      expect(BOARD_MATERIALS.darkSquare.metalness).toBeGreaterThanOrEqual(0);
      expect(BOARD_MATERIALS.darkSquare.metalness).toBeLessThanOrEqual(1);
    });

    it('has normalScale between 0 and 2', () => {
      expect(BOARD_MATERIALS.darkSquare.normalScale).toBeGreaterThanOrEqual(0);
      expect(BOARD_MATERIALS.darkSquare.normalScale).toBeLessThanOrEqual(2);
    });
  });
});

describe('BOARD_BORDER', () => {
  it('references wood texture set', () => {
    expect(BOARD_BORDER.textureSet).toBe(TEXTURE_SETS.wood);
  });
});

describe('getBoardSquareMaterial', () => {
  it('returns lightSquare config for isLight=true', () => {
    expect(getBoardSquareMaterial(true)).toBe(BOARD_MATERIALS.lightSquare);
  });

  it('returns darkSquare config for isLight=false', () => {
    expect(getBoardSquareMaterial(false)).toBe(BOARD_MATERIALS.darkSquare);
  });
});
