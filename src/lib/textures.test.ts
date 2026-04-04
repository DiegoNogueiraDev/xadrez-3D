import { describe, it, expect } from 'vitest';
import { TEXTURE_SETS, type TextureSet, type TextureSetId } from './textures';

describe('TEXTURE_SETS', () => {
  it('exports 3 texture sets: marble_light, marble_dark, wood', () => {
    expect(Object.keys(TEXTURE_SETS)).toHaveLength(3);
    expect(TEXTURE_SETS).toHaveProperty('marble_light');
    expect(TEXTURE_SETS).toHaveProperty('marble_dark');
    expect(TEXTURE_SETS).toHaveProperty('wood');
  });

  it('each set has diffuse, normal, and roughness map paths', () => {
    for (const [id, set] of Object.entries(TEXTURE_SETS)) {
      expect(set).toHaveProperty('diffuse');
      expect(set).toHaveProperty('normal');
      expect(set).toHaveProperty('roughness');
      expect(typeof set.diffuse).toBe('string');
      expect(typeof set.normal).toBe('string');
      expect(typeof set.roughness).toBe('string');
    }
  });

  it('all paths start with /assets/textures/', () => {
    for (const set of Object.values(TEXTURE_SETS)) {
      expect(set.diffuse).toMatch(/^\/assets\/textures\//);
      expect(set.normal).toMatch(/^\/assets\/textures\//);
      expect(set.roughness).toMatch(/^\/assets\/textures\//);
    }
  });

  it('each set has a label property', () => {
    for (const set of Object.values(TEXTURE_SETS)) {
      expect(set).toHaveProperty('label');
      expect(typeof set.label).toBe('string');
      expect(set.label.length).toBeGreaterThan(0);
    }
  });

  it('each set has a polyhaven source ID', () => {
    for (const set of Object.values(TEXTURE_SETS)) {
      expect(set).toHaveProperty('sourceId');
      expect(typeof set.sourceId).toBe('string');
    }
  });

  it('TextureSetId type covers all 3 keys', () => {
    const ids: TextureSetId[] = ['marble_light', 'marble_dark', 'wood'];
    expect(ids).toHaveLength(3);
    ids.forEach((id) => expect(TEXTURE_SETS[id]).toBeDefined());
  });
});
