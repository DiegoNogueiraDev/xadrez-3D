import { describe, it, expect } from 'vitest';
import { MODEL_MANIFEST, getModelPath, type ModelKey } from './modelManifest';

const PIECE_TYPES = ['p', 'r', 'n', 'b', 'q', 'k'] as const;
const COLORS = ['w', 'b'] as const;

describe('MODEL_MANIFEST', () => {
  it('has exactly 12 entries (6 pieces x 2 colors)', () => {
    expect(Object.keys(MODEL_MANIFEST)).toHaveLength(12);
  });

  it('has entries for all piece type + color combinations', () => {
    for (const type of PIECE_TYPES) {
      for (const color of COLORS) {
        const key: ModelKey = `${type}-${color}`;
        expect(MODEL_MANIFEST).toHaveProperty(key);
      }
    }
  });

  it('all paths point to /assets/models/*.glb', () => {
    for (const entry of Object.values(MODEL_MANIFEST)) {
      expect(entry.path).toMatch(/^\/assets\/models\/.*\.glb$/);
    }
  });

  it('each entry has path and label fields', () => {
    for (const entry of Object.values(MODEL_MANIFEST)) {
      expect(typeof entry.path).toBe('string');
      expect(typeof entry.label).toBe('string');
      expect(entry.label.length).toBeGreaterThan(0);
    }
  });
});

describe('getModelPath', () => {
  it('returns the correct path for a given type and color', () => {
    expect(getModelPath('p', 'w')).toBe('/assets/models/pawn_white.glb');
    expect(getModelPath('k', 'b')).toBe('/assets/models/king_black.glb');
  });

  it('returns correct path for all 12 combinations', () => {
    for (const type of PIECE_TYPES) {
      for (const color of COLORS) {
        const path = getModelPath(type, color);
        expect(path).toMatch(/^\/assets\/models\/.*\.glb$/);
      }
    }
  });

  it('path contains the piece name and color', () => {
    expect(getModelPath('q', 'w')).toContain('queen');
    expect(getModelPath('q', 'w')).toContain('white');
    expect(getModelPath('n', 'b')).toContain('knight');
    expect(getModelPath('n', 'b')).toContain('black');
  });
});
