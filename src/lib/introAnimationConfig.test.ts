import { describe, it, expect } from 'vitest';
import { INTRO_ANIMATION_CONFIG, getIntroDelay } from './introAnimationConfig';

describe('INTRO_ANIMATION_CONFIG', () => {
  it('has totalPieces = 32', () => {
    expect(INTRO_ANIMATION_CONFIG.totalPieces).toBe(32);
  });

  it('has scaleFrom = 0 and scaleTo = 1', () => {
    expect(INTRO_ANIMATION_CONFIG.scaleFrom).toBe(0);
    expect(INTRO_ANIMATION_CONFIG.scaleTo).toBe(1);
  });

  it('has staggerDelay between 30 and 100ms', () => {
    expect(INTRO_ANIMATION_CONFIG.staggerDelay).toBeGreaterThanOrEqual(30);
    expect(INTRO_ANIMATION_CONFIG.staggerDelay).toBeLessThanOrEqual(100);
  });

  it('total duration < 3200ms', () => {
    const total = INTRO_ANIMATION_CONFIG.totalPieces * INTRO_ANIMATION_CONFIG.staggerDelay;
    expect(total).toBeLessThan(3200);
  });

  it('has springConfig with tension and friction', () => {
    expect(typeof INTRO_ANIMATION_CONFIG.springConfig.tension).toBe('number');
    expect(typeof INTRO_ANIMATION_CONFIG.springConfig.friction).toBe('number');
  });
});

describe('getIntroDelay', () => {
  it('returns 0 for first piece (index 0)', () => {
    expect(getIntroDelay(0)).toBe(0);
  });

  it('returns staggerDelay * index', () => {
    const delay = INTRO_ANIMATION_CONFIG.staggerDelay;
    expect(getIntroDelay(5)).toBe(5 * delay);
    expect(getIntroDelay(16)).toBe(16 * delay);
  });

  it('white pieces (0-15) have lower delays than black (16-31)', () => {
    const lastWhiteDelay = getIntroDelay(15);
    const firstBlackDelay = getIntroDelay(16);
    expect(firstBlackDelay).toBeGreaterThan(lastWhiteDelay);
  });

  it('last piece (index 31) delay is within total duration', () => {
    const lastDelay = getIntroDelay(31);
    expect(lastDelay).toBeLessThan(3200);
  });
});
