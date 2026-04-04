import { describe, it, expect } from 'vitest';
import { QUALITY_PRESETS, getQualitySettings, type QualitySettings } from './qualityPresets';

describe('QUALITY_PRESETS', () => {
  it('has exactly 3 presets: low, medium, high', () => {
    expect(Object.keys(QUALITY_PRESETS)).toHaveLength(3);
    expect(QUALITY_PRESETS).toHaveProperty('low');
    expect(QUALITY_PRESETS).toHaveProperty('medium');
    expect(QUALITY_PRESETS).toHaveProperty('high');
  });

  it('low preset disables shadows, particles, antialias and uses pixelRatio=1', () => {
    const low = QUALITY_PRESETS.low;
    expect(low.shadows).toBe(false);
    expect(low.particles).toBe(false);
    expect(low.pixelRatio).toBe(1);
    expect(low.antialias).toBe(false);
  });

  it('medium preset enables shadows, particles but uses pixelRatio=1.5', () => {
    const med = QUALITY_PRESETS.medium;
    expect(med.shadows).toBe(true);
    expect(med.particles).toBe(true);
    expect(med.pixelRatio).toBe(1.5);
    expect(med.antialias).toBe(true);
  });

  it('high preset enables everything with pixelRatio=2', () => {
    const high = QUALITY_PRESETS.high;
    expect(high.shadows).toBe(true);
    expect(high.particles).toBe(true);
    expect(high.pixelRatio).toBe(2);
    expect(high.antialias).toBe(true);
  });

  it('low: particleCountMultiplier=0, textureResolution=512', () => {
    expect(QUALITY_PRESETS.low.particleCountMultiplier).toBe(0);
    expect(QUALITY_PRESETS.low.textureResolution).toBe('512');
  });

  it('medium: particleCountMultiplier=0.5, textureResolution=1024', () => {
    expect(QUALITY_PRESETS.medium.particleCountMultiplier).toBe(0.5);
    expect(QUALITY_PRESETS.medium.textureResolution).toBe('1024');
  });

  it('high: particleCountMultiplier=1.0, textureResolution=2048', () => {
    expect(QUALITY_PRESETS.high.particleCountMultiplier).toBe(1);
    expect(QUALITY_PRESETS.high.textureResolution).toBe('2048');
  });

  it('each preset has all required fields', () => {
    for (const preset of Object.values(QUALITY_PRESETS)) {
      expect(preset).toHaveProperty('shadows');
      expect(preset).toHaveProperty('particles');
      expect(preset).toHaveProperty('pixelRatio');
      expect(preset).toHaveProperty('antialias');
      expect(preset).toHaveProperty('shadowMapSize');
      expect(preset).toHaveProperty('particleCountMultiplier');
      expect(preset).toHaveProperty('textureResolution');
    }
  });
});

describe('getQualitySettings', () => {
  it('returns correct preset for each quality level', () => {
    expect(getQualitySettings('low')).toEqual(QUALITY_PRESETS.low);
    expect(getQualitySettings('medium')).toEqual(QUALITY_PRESETS.medium);
    expect(getQualitySettings('high')).toEqual(QUALITY_PRESETS.high);
  });
});
