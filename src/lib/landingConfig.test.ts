import { describe, it, expect } from 'vitest';
import { LANDING_CONFIG } from './landingConfig';

describe('LANDING_CONFIG', () => {
  it('has wobbleRotation in radians (small angle)', () => {
    expect(LANDING_CONFIG.wobbleRotation).toBeGreaterThan(0);
    expect(LANDING_CONFIG.wobbleRotation).toBeLessThan(0.5);
  });

  it('has squashScale less than 1 for compression effect', () => {
    expect(LANDING_CONFIG.squashScale).toBeLessThan(1);
    expect(LANDING_CONFIG.squashScale).toBeGreaterThan(0.5);
  });

  it('has stretchScale greater than 1 for rebound effect', () => {
    expect(LANDING_CONFIG.stretchScale).toBeGreaterThan(1);
    expect(LANDING_CONFIG.stretchScale).toBeLessThan(1.5);
  });

  it('has defaultRotationY=0 and defaultScaleY=1', () => {
    expect(LANDING_CONFIG.defaultRotationY).toBe(0);
    expect(LANDING_CONFIG.defaultScaleY).toBe(1);
  });

  it('has springConfig with tension and friction', () => {
    expect(typeof LANDING_CONFIG.springConfig.tension).toBe('number');
    expect(typeof LANDING_CONFIG.springConfig.friction).toBe('number');
    expect(LANDING_CONFIG.springConfig.tension).toBeGreaterThan(0);
  });
});
