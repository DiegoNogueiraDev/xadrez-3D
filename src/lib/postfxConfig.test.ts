import { describe, it, expect } from 'vitest';
import { POSTFX_CONFIG, getPostFXForQuality } from './postfxConfig';

describe('POSTFX_CONFIG', () => {
  describe('bloom', () => {
    it('has threshold between 0 and 1', () => {
      expect(POSTFX_CONFIG.bloom.threshold).toBeGreaterThanOrEqual(0);
      expect(POSTFX_CONFIG.bloom.threshold).toBeLessThanOrEqual(1);
    });

    it('has strength between 0 and 3', () => {
      expect(POSTFX_CONFIG.bloom.strength).toBeGreaterThanOrEqual(0);
      expect(POSTFX_CONFIG.bloom.strength).toBeLessThanOrEqual(3);
    });

    it('has radius between 0 and 1', () => {
      expect(POSTFX_CONFIG.bloom.radius).toBeGreaterThanOrEqual(0);
      expect(POSTFX_CONFIG.bloom.radius).toBeLessThanOrEqual(1);
    });

    it('has enabled flag', () => {
      expect(typeof POSTFX_CONFIG.bloom.enabled).toBe('boolean');
    });
  });

  describe('ssao', () => {
    it('has radius between 0 and 1', () => {
      expect(POSTFX_CONFIG.ssao.radius).toBeGreaterThanOrEqual(0);
      expect(POSTFX_CONFIG.ssao.radius).toBeLessThanOrEqual(1);
    });

    it('has intensity between 0 and 5', () => {
      expect(POSTFX_CONFIG.ssao.intensity).toBeGreaterThanOrEqual(0);
      expect(POSTFX_CONFIG.ssao.intensity).toBeLessThanOrEqual(5);
    });

    it('has luminanceInfluence between 0 and 1', () => {
      expect(POSTFX_CONFIG.ssao.luminanceInfluence).toBeGreaterThanOrEqual(0);
      expect(POSTFX_CONFIG.ssao.luminanceInfluence).toBeLessThanOrEqual(1);
    });

    it('has enabled flag', () => {
      expect(typeof POSTFX_CONFIG.ssao.enabled).toBe('boolean');
    });
  });

  describe('vignette', () => {
    it('has offset between 0 and 1', () => {
      expect(POSTFX_CONFIG.vignette.offset).toBeGreaterThanOrEqual(0);
      expect(POSTFX_CONFIG.vignette.offset).toBeLessThanOrEqual(1);
    });

    it('has darkness between 0 and 2', () => {
      expect(POSTFX_CONFIG.vignette.darkness).toBeGreaterThanOrEqual(0);
      expect(POSTFX_CONFIG.vignette.darkness).toBeLessThanOrEqual(2);
    });

    it('has enabled flag', () => {
      expect(typeof POSTFX_CONFIG.vignette.enabled).toBe('boolean');
    });
  });
});

describe('getPostFXForQuality', () => {
  it('low: all effects disabled', () => {
    const config = getPostFXForQuality('low');
    expect(config.bloom.enabled).toBe(false);
    expect(config.ssao.enabled).toBe(false);
    expect(config.vignette.enabled).toBe(false);
  });

  it('medium: bloom enabled, ssao disabled, vignette enabled', () => {
    const config = getPostFXForQuality('medium');
    expect(config.bloom.enabled).toBe(true);
    expect(config.ssao.enabled).toBe(false);
    expect(config.vignette.enabled).toBe(true);
  });

  it('high: all effects enabled', () => {
    const config = getPostFXForQuality('high');
    expect(config.bloom.enabled).toBe(true);
    expect(config.ssao.enabled).toBe(true);
    expect(config.vignette.enabled).toBe(true);
  });
});
