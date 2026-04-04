import { describe, it, expect } from 'vitest';
import { LIGHTING_CONFIG, getLightingForQuality } from './lightingConfig';

describe('LIGHTING_CONFIG', () => {
  describe('key light', () => {
    it('has position [4,8,3]', () => {
      expect(LIGHTING_CONFIG.key.position).toEqual([4, 8, 3]);
    });

    it('has warm golden color for medieval atmosphere', () => {
      expect(LIGHTING_CONFIG.key.color).toBe('#FFD49E');
    });

    it('has intensity 0.8 for dimm medieval lighting', () => {
      expect(LIGHTING_CONFIG.key.intensity).toBe(0.8);
    });

    it('casts shadows with mapSize 2048', () => {
      expect(LIGHTING_CONFIG.key.castShadow).toBe(true);
      expect(LIGHTING_CONFIG.key.shadowMapSize).toBe(2048);
    });
  });

  describe('fill light', () => {
    it('has position [-4,4,-4]', () => {
      expect(LIGHTING_CONFIG.fill.position).toEqual([-4, 4, -4]);
    });

    it('has low intensity for subtle fill', () => {
      expect(LIGHTING_CONFIG.fill.intensity).toBe(0.2);
    });

    it('does not cast shadows', () => {
      expect(LIGHTING_CONFIG.fill.castShadow).toBe(false);
    });
  });

  describe('rim light', () => {
    it('has position [0,6,-6]', () => {
      expect(LIGHTING_CONFIG.rim.position).toEqual([0, 6, -6]);
    });

    it('has intensity 0.3 for subtle rim', () => {
      expect(LIGHTING_CONFIG.rim.intensity).toBe(0.3);
    });

    it('does not cast shadows', () => {
      expect(LIGHTING_CONFIG.rim.castShadow).toBe(false);
    });
  });

  describe('ambient light', () => {
    it('has low intensity 0.15 for medieval atmosphere', () => {
      expect(LIGHTING_CONFIG.ambient.intensity).toBe(0.15);
    });
  });
});

describe('getLightingForQuality', () => {
  it('low quality: no shadows', () => {
    const config = getLightingForQuality('low');
    expect(config.key.castShadow).toBe(false);
  });

  it('medium quality: shadows with 1024 mapSize', () => {
    const config = getLightingForQuality('medium');
    expect(config.key.castShadow).toBe(true);
    expect(config.key.shadowMapSize).toBe(1024);
  });

  it('high quality: shadows with 2048 mapSize', () => {
    const config = getLightingForQuality('high');
    expect(config.key.castShadow).toBe(true);
    expect(config.key.shadowMapSize).toBe(2048);
  });
});
