import { describe, it, expect } from 'vitest';
import { CONTACT_SHADOWS_CONFIG, getContactShadowsForQuality } from './contactShadowsConfig';
import { BOARD_MODEL_CONFIG } from './boardModelConfig';

describe('CONTACT_SHADOWS_CONFIG', () => {
  it('has opacity between 0.3 and 0.8', () => {
    expect(CONTACT_SHADOWS_CONFIG.opacity).toBeGreaterThanOrEqual(0.3);
    expect(CONTACT_SHADOWS_CONFIG.opacity).toBeLessThanOrEqual(0.8);
  });

  it('has blur between 1 and 4', () => {
    expect(CONTACT_SHADOWS_CONFIG.blur).toBeGreaterThanOrEqual(1);
    expect(CONTACT_SHADOWS_CONFIG.blur).toBeLessThanOrEqual(4);
  });

  it('position.y matches board surface height', () => {
    expect(CONTACT_SHADOWS_CONFIG.position[1]).toBeCloseTo(BOARD_MODEL_CONFIG.boardHeight + 0.01, 1);
  });

  it('has width and height covering board area', () => {
    expect(CONTACT_SHADOWS_CONFIG.width).toBeGreaterThanOrEqual(BOARD_MODEL_CONFIG.boardSize);
    expect(CONTACT_SHADOWS_CONFIG.height).toBeGreaterThanOrEqual(BOARD_MODEL_CONFIG.boardSize);
  });

  it('has far > 0 and resolution > 0', () => {
    expect(CONTACT_SHADOWS_CONFIG.far).toBeGreaterThan(0);
    expect(CONTACT_SHADOWS_CONFIG.resolution).toBeGreaterThan(0);
  });

  it('has frames property', () => {
    expect(typeof CONTACT_SHADOWS_CONFIG.frames).toBe('number');
  });
});

describe('getContactShadowsForQuality', () => {
  it('low: disabled', () => {
    const config = getContactShadowsForQuality('low');
    expect(config.enabled).toBe(false);
  });

  it('medium: enabled with resolution 512', () => {
    const config = getContactShadowsForQuality('medium');
    expect(config.enabled).toBe(true);
    expect(config.resolution).toBe(512);
  });

  it('high: enabled with resolution 1024', () => {
    const config = getContactShadowsForQuality('high');
    expect(config.enabled).toBe(true);
    expect(config.resolution).toBe(1024);
  });
});
