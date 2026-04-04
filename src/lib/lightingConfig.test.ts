import { describe, it, expect } from 'vitest';
import { LIGHTING_CONFIG, getLightingForQuality } from './lightingConfig';

describe('LIGHTING_CONFIG', () => {
  describe('key light', () => {
    it('has position [5,10,5]', () => {
      expect(LIGHTING_CONFIG.key.position).toEqual([5, 10, 5]);
    });

    it('has intensity between 1.5 and 2.5', () => {
      expect(LIGHTING_CONFIG.key.intensity).toBeGreaterThanOrEqual(1.5);
      expect(LIGHTING_CONFIG.key.intensity).toBeLessThanOrEqual(2.5);
    });

    it('casts shadows with mapSize 2048', () => {
      expect(LIGHTING_CONFIG.key.castShadow).toBe(true);
      expect(LIGHTING_CONFIG.key.shadowMapSize).toBe(2048);
    });
  });

  describe('fill light', () => {
    it('has position [-5,5,-5]', () => {
      expect(LIGHTING_CONFIG.fill.position).toEqual([-5, 5, -5]);
    });

    it('has intensity between 0.3 and 0.7', () => {
      expect(LIGHTING_CONFIG.fill.intensity).toBeGreaterThanOrEqual(0.3);
      expect(LIGHTING_CONFIG.fill.intensity).toBeLessThanOrEqual(0.7);
    });

    it('does not cast shadows', () => {
      expect(LIGHTING_CONFIG.fill.castShadow).toBe(false);
    });
  });

  describe('rim light', () => {
    it('has position [0,8,-8]', () => {
      expect(LIGHTING_CONFIG.rim.position).toEqual([0, 8, -8]);
    });

    it('has intensity between 0.5 and 1.0', () => {
      expect(LIGHTING_CONFIG.rim.intensity).toBeGreaterThanOrEqual(0.5);
      expect(LIGHTING_CONFIG.rim.intensity).toBeLessThanOrEqual(1.0);
    });

    it('does not cast shadows', () => {
      expect(LIGHTING_CONFIG.rim.castShadow).toBe(false);
    });
  });

  describe('ambient light', () => {
    it('has intensity between 0.2 and 0.4', () => {
      expect(LIGHTING_CONFIG.ambient.intensity).toBeGreaterThanOrEqual(0.2);
      expect(LIGHTING_CONFIG.ambient.intensity).toBeLessThanOrEqual(0.4);
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
