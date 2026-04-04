import { describe, it, expect } from 'vitest';
import { SELECTION_CONFIG } from './selectionConfig';

describe('SELECTION_CONFIG', () => {
  it('has scale of 1.05 for selected pieces', () => {
    expect(SELECTION_CONFIG.scale).toBe(1.05);
  });

  it('has emissiveIntensity of 0.3 for glow effect', () => {
    expect(SELECTION_CONFIG.emissiveIntensity).toBe(0.3);
  });

  it('has emissiveColor as a hex string', () => {
    expect(typeof SELECTION_CONFIG.emissiveColor).toBe('string');
    expect(SELECTION_CONFIG.emissiveColor).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('has springConfig with tension and friction', () => {
    expect(SELECTION_CONFIG.springConfig).toHaveProperty('tension');
    expect(SELECTION_CONFIG.springConfig).toHaveProperty('friction');
    expect(typeof SELECTION_CONFIG.springConfig.tension).toBe('number');
    expect(typeof SELECTION_CONFIG.springConfig.friction).toBe('number');
  });

  it('has deselected defaults: scale=1, emissiveIntensity=0', () => {
    expect(SELECTION_CONFIG.defaultScale).toBe(1);
    expect(SELECTION_CONFIG.defaultEmissiveIntensity).toBe(0);
  });
});
