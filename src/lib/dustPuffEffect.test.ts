import { describe, it, expect } from 'vitest';
import { DUST_PUFF_CONFIG, createDustPuff } from './dustPuffEffect';

describe('DUST_PUFF_CONFIG', () => {
  it('has count between 15 and 30', () => {
    expect(DUST_PUFF_CONFIG.count).toBeGreaterThanOrEqual(15);
    expect(DUST_PUFF_CONFIG.count).toBeLessThanOrEqual(30);
  });

  it('has lifetime between 0.2 and 0.5 for ~300ms dissipation', () => {
    expect(DUST_PUFF_CONFIG.lifetime).toBeGreaterThanOrEqual(0.2);
    expect(DUST_PUFF_CONFIG.lifetime).toBeLessThanOrEqual(0.5);
  });

  it('has gray color', () => {
    expect(DUST_PUFF_CONFIG.color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('has small particle size between 0.02 and 0.05', () => {
    expect(DUST_PUFF_CONFIG.size).toBeGreaterThanOrEqual(0.02);
    expect(DUST_PUFF_CONFIG.size).toBeLessThanOrEqual(0.05);
  });
});

describe('createDustPuff', () => {
  const center: [number, number, number] = [2, 0.2, 3];

  it('returns ParticleState with correct count', () => {
    const state = createDustPuff(center);
    expect(state.positions.length).toBe(DUST_PUFF_CONFIG.count * 3);
    expect(state.velocities.length).toBe(DUST_PUFF_CONFIG.count * 3);
    expect(state.lifetimes.length).toBe(DUST_PUFF_CONFIG.count);
  });

  it('particles have upward Y velocity', () => {
    const state = createDustPuff(center);
    let upwardCount = 0;
    for (let i = 0; i < DUST_PUFF_CONFIG.count; i++) {
      if (state.velocities[i * 3 + 1] > 0) upwardCount++;
    }
    expect(upwardCount).toBe(DUST_PUFF_CONFIG.count);
  });

  it('particles radiate outward in XZ plane', () => {
    const state = createDustPuff(center);
    let outwardCount = 0;
    for (let i = 0; i < DUST_PUFF_CONFIG.count; i++) {
      const vx = state.velocities[i * 3];
      const vz = state.velocities[i * 3 + 2];
      const dx = state.positions[i * 3] - center[0];
      const dz = state.positions[i * 3 + 2] - center[2];
      if (vx * dx + vz * dz >= 0) outwardCount++;
    }
    expect(outwardCount).toBeGreaterThan(DUST_PUFF_CONFIG.count * 0.7);
  });

  it('sets lifetimes to config value', () => {
    const state = createDustPuff(center);
    for (let i = 0; i < DUST_PUFF_CONFIG.count; i++) {
      expect(state.lifetimes[i]).toBeCloseTo(DUST_PUFF_CONFIG.lifetime, 2);
    }
  });
});
