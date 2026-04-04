import { describe, it, expect } from 'vitest';
import { AMBIENT_CONFIG } from './ambientConfig';

describe('AMBIENT_CONFIG', () => {
  describe('room', () => {
    it('has volume between 0.1 and 0.3', () => {
      expect(AMBIENT_CONFIG.room.volume).toBeGreaterThanOrEqual(0.1);
      expect(AMBIENT_CONFIG.room.volume).toBeLessThanOrEqual(0.3);
    });

    it('has fadeInDuration between 2000 and 5000ms', () => {
      expect(AMBIENT_CONFIG.room.fadeInDuration).toBeGreaterThanOrEqual(2000);
      expect(AMBIENT_CONFIG.room.fadeInDuration).toBeLessThanOrEqual(5000);
    });

    it('loops continuously', () => {
      expect(AMBIENT_CONFIG.room.loop).toBe(true);
    });

    it('soundId matches ambient in manifest', () => {
      expect(AMBIENT_CONFIG.room.soundId).toBe('ambient');
    });
  });

  describe('clock', () => {
    it('has volume between 0.05 and 0.15', () => {
      expect(AMBIENT_CONFIG.clock.volume).toBeGreaterThanOrEqual(0.05);
      expect(AMBIENT_CONFIG.clock.volume).toBeLessThanOrEqual(0.15);
    });

    it('has fadeInDuration between 1000 and 3000ms', () => {
      expect(AMBIENT_CONFIG.clock.fadeInDuration).toBeGreaterThanOrEqual(1000);
      expect(AMBIENT_CONFIG.clock.fadeInDuration).toBeLessThanOrEqual(3000);
    });

    it('loops continuously', () => {
      expect(AMBIENT_CONFIG.clock.loop).toBe(true);
    });

    it('is optional', () => {
      expect(AMBIENT_CONFIG.clock.optional).toBe(true);
    });
  });
});
