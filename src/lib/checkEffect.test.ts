import { describe, it, expect } from 'vitest';
import { CHECK_EFFECT_CONFIG, createCheckParticles } from './checkEffect';

describe('CHECK_EFFECT_CONFIG', () => {
  it('has gold particle config with count >= 20', () => {
    expect(CHECK_EFFECT_CONFIG.particleConfig.count).toBeGreaterThanOrEqual(20);
  });

  it('has gold color #ffd700', () => {
    expect(CHECK_EFFECT_CONFIG.particleConfig.color).toBe('#ffd700');
  });

  it('has negative gravity for upward drift', () => {
    expect(CHECK_EFFECT_CONFIG.particleConfig.gravity).toBeLessThan(0);
  });

  it('has ringRadius for ring layout', () => {
    expect(CHECK_EFFECT_CONFIG.ringRadius).toBeGreaterThan(0);
  });

  it('has cameraShake with intensity <= 0.05', () => {
    expect(CHECK_EFFECT_CONFIG.cameraShake.intensity).toBeGreaterThan(0);
    expect(CHECK_EFFECT_CONFIG.cameraShake.intensity).toBeLessThanOrEqual(0.05);
  });

  it('has cameraShake with duration in ms and decayRate', () => {
    expect(CHECK_EFFECT_CONFIG.cameraShake.duration).toBeGreaterThan(0);
    expect(CHECK_EFFECT_CONFIG.cameraShake.decayRate).toBeGreaterThan(0);
  });
});

describe('createCheckParticles', () => {
  it('returns ParticleState with correct count', () => {
    const center: [number, number, number] = [0, 0, 0];
    const state = createCheckParticles(center);
    const count = CHECK_EFFECT_CONFIG.particleConfig.count;

    expect(state.positions).toBeInstanceOf(Float32Array);
    expect(state.positions.length).toBe(count * 3);
    expect(state.velocities).toBeInstanceOf(Float32Array);
    expect(state.velocities.length).toBe(count * 3);
    expect(state.lifetimes).toBeInstanceOf(Float32Array);
    expect(state.lifetimes.length).toBe(count);
  });

  it('distributes positions in a ring around center', () => {
    const center: [number, number, number] = [2, 0, 3];
    const state = createCheckParticles(center);
    const count = CHECK_EFFECT_CONFIG.particleConfig.count;
    const radius = CHECK_EFFECT_CONFIG.ringRadius;

    // Check that particles are approximately at ring radius from center (XZ plane)
    for (let i = 0; i < count; i++) {
      const dx = state.positions[i * 3] - center[0];
      const dz = state.positions[i * 3 + 2] - center[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      expect(dist).toBeCloseTo(radius, 0);
    }
  });

  it('sets lifetimes to config lifetime value', () => {
    const state = createCheckParticles([0, 0, 0]);
    const count = CHECK_EFFECT_CONFIG.particleConfig.count;

    for (let i = 0; i < count; i++) {
      expect(state.lifetimes[i]).toBe(CHECK_EFFECT_CONFIG.particleConfig.lifetime);
    }
  });
});
