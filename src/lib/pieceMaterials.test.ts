import { describe, it, expect } from 'vitest';
import { PIECE_MATERIALS, getPieceMaterial } from './pieceMaterials';

describe('PIECE_MATERIALS', () => {
  describe('white material', () => {
    const white = PIECE_MATERIALS.white;

    it('has ivory/marble color #F5F0E8', () => {
      expect(white.color).toBe('#F5F0E8');
    });

    it('has ivory roughness of 0.3', () => {
      expect(white.roughness).toBe(0.3);
    });

    it('has metalness between 0 and 0.1', () => {
      expect(white.metalness).toBeGreaterThanOrEqual(0);
      expect(white.metalness).toBeLessThanOrEqual(0.1);
    });

    it('has emissiveColor and emissiveIntensity', () => {
      expect(typeof white.emissiveColor).toBe('string');
      expect(typeof white.emissiveIntensity).toBe('number');
    });

    it('has clearcoat=1.0 for ivory sheen', () => {
      expect(white.clearcoat).toBe(1.0);
    });

    it('has clearcoatRoughness between 0 and 0.2', () => {
      expect(white.clearcoatRoughness).toBeGreaterThanOrEqual(0);
      expect(white.clearcoatRoughness).toBeLessThanOrEqual(0.2);
    });
  });

  describe('black material', () => {
    const black = PIECE_MATERIALS.black;

    it('has obsidian/ebony color #1A1A2E', () => {
      expect(black.color).toBe('#1A1A2E');
    });

    it('has roughness between 0.2 and 0.4', () => {
      expect(black.roughness).toBeGreaterThanOrEqual(0.2);
      expect(black.roughness).toBeLessThanOrEqual(0.4);
    });

    it('has obsidian metalness of 0.4', () => {
      expect(black.metalness).toBe(0.4);
    });

    it('has emissiveColor and emissiveIntensity', () => {
      expect(typeof black.emissiveColor).toBe('string');
      expect(typeof black.emissiveIntensity).toBe('number');
    });

    it('has clearcoat between 0.5 and 1.0', () => {
      expect(black.clearcoat).toBeGreaterThanOrEqual(0.5);
      expect(black.clearcoat).toBeLessThanOrEqual(1.0);
    });

    it('has clearcoatRoughness between 0 and 0.3', () => {
      expect(black.clearcoatRoughness).toBeGreaterThanOrEqual(0);
      expect(black.clearcoatRoughness).toBeLessThanOrEqual(0.3);
    });
  });
});

describe('getPieceMaterial', () => {
  it('returns white config for color "w"', () => {
    expect(getPieceMaterial('w')).toBe(PIECE_MATERIALS.white);
  });

  it('returns black config for color "b"', () => {
    expect(getPieceMaterial('b')).toBe(PIECE_MATERIALS.black);
  });
});
