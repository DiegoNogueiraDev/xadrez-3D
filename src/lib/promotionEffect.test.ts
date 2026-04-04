import { describe, it, expect } from 'vitest';
import {
  PROMOTION_EFFECT_CONFIG,
  createDissolveParticles,
  createMaterializeParticles,
} from './promotionEffect';

describe('PROMOTION_EFFECT_CONFIG', () => {
  it('has dissolve particle config with count >= 30', () => {
    expect(PROMOTION_EFFECT_CONFIG.dissolve.count).toBeGreaterThanOrEqual(30);
  });

  it('has dissolve lifetime between 0.8 and 1.5', () => {
    expect(PROMOTION_EFFECT_CONFIG.dissolve.lifetime).toBeGreaterThanOrEqual(0.8);
    expect(PROMOTION_EFFECT_CONFIG.dissolve.lifetime).toBeLessThanOrEqual(1.5);
  });

  it('has materialize particle config with count >= 30', () => {
    expect(PROMOTION_EFFECT_CONFIG.materialize.count).toBeGreaterThanOrEqual(30);
  });

  it('has materialize lifetime between 0.8 and 1.5', () => {
    expect(PROMOTION_EFFECT_CONFIG.materialize.lifetime).toBeGreaterThanOrEqual(0.8);
    expect(PROMOTION_EFFECT_CONFIG.materialize.lifetime).toBeLessThanOrEqual(1.5);
  });

  it('has timing with dissolveDuration and materializeDuration in ms', () => {
    expect(PROMOTION_EFFECT_CONFIG.timing.dissolveDuration).toBeGreaterThan(0);
    expect(PROMOTION_EFFECT_CONFIG.timing.materializeDuration).toBeGreaterThan(0);
  });
});

describe('createDissolveParticles', () => {
  const center: [number, number, number] = [1, 0, 2];

  it('returns ParticleState with correct count', () => {
    const state = createDissolveParticles(center);
    const count = PROMOTION_EFFECT_CONFIG.dissolve.count;
    expect(state.positions.length).toBe(count * 3);
    expect(state.velocities.length).toBe(count * 3);
    expect(state.lifetimes.length).toBe(count);
  });

  it('particles have outward velocities from center', () => {
    const state = createDissolveParticles(center);
    const count = PROMOTION_EFFECT_CONFIG.dissolve.count;
    let outwardCount = 0;
    for (let i = 0; i < count; i++) {
      const vx = state.velocities[i * 3];
      const vz = state.velocities[i * 3 + 2];
      const dx = state.positions[i * 3] - center[0];
      const dz = state.positions[i * 3 + 2] - center[2];
      // Dot product > 0 means outward
      if (vx * dx + vz * dz >= 0) outwardCount++;
    }
    // Most particles should move outward
    expect(outwardCount).toBeGreaterThan(count * 0.7);
  });
});

describe('createMaterializeParticles', () => {
  const center: [number, number, number] = [1, 0, 2];

  it('returns ParticleState with correct count', () => {
    const state = createMaterializeParticles(center);
    const count = PROMOTION_EFFECT_CONFIG.materialize.count;
    expect(state.positions.length).toBe(count * 3);
    expect(state.velocities.length).toBe(count * 3);
    expect(state.lifetimes.length).toBe(count);
  });

  it('particles have inward velocities toward center', () => {
    const state = createMaterializeParticles(center);
    const count = PROMOTION_EFFECT_CONFIG.materialize.count;
    let inwardCount = 0;
    for (let i = 0; i < count; i++) {
      const vx = state.velocities[i * 3];
      const vz = state.velocities[i * 3 + 2];
      const dx = state.positions[i * 3] - center[0];
      const dz = state.positions[i * 3 + 2] - center[2];
      // Dot product < 0 means inward
      if (vx * dx + vz * dz <= 0) inwardCount++;
    }
    expect(inwardCount).toBeGreaterThan(count * 0.7);
  });
});
