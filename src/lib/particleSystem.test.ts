import { describe, it, expect } from 'vitest';
import {
  createParticles,
  updateParticles,
  DUST_PRESET,
  SPARKLE_PRESET,
  DEBRIS_PRESET,
  type ParticleConfig,
  type ParticleState,
} from './particleSystem';

describe('ParticleConfig presets', () => {
  it('exports DUST_PRESET with small/slow/gray params', () => {
    expect(DUST_PRESET).toBeDefined();
    expect(DUST_PRESET.count).toBeGreaterThan(0);
    expect(DUST_PRESET.size).toBeLessThan(DEBRIS_PRESET.size);
    expect(DUST_PRESET.velocity).toBeLessThan(DEBRIS_PRESET.velocity);
    expect(DUST_PRESET.color).toBe('#888888');
  });

  it('exports SPARKLE_PRESET with tiny/upward/gold params', () => {
    expect(SPARKLE_PRESET).toBeDefined();
    expect(SPARKLE_PRESET.count).toBeGreaterThan(0);
    expect(SPARKLE_PRESET.gravity).toBeLessThan(0); // negative = upward
    expect(SPARKLE_PRESET.color).toBe('#ffd700');
  });

  it('exports DEBRIS_PRESET with large/fast/brown params', () => {
    expect(DEBRIS_PRESET).toBeDefined();
    expect(DEBRIS_PRESET.count).toBeGreaterThan(0);
    expect(DEBRIS_PRESET.size).toBeGreaterThan(DUST_PRESET.size);
    expect(DEBRIS_PRESET.velocity).toBeGreaterThan(DUST_PRESET.velocity);
    expect(DEBRIS_PRESET.color).toBe('#8b4513');
  });

  it('each preset has all required fields', () => {
    for (const preset of [DUST_PRESET, SPARKLE_PRESET, DEBRIS_PRESET]) {
      expect(preset).toHaveProperty('count');
      expect(preset).toHaveProperty('lifetime');
      expect(preset).toHaveProperty('velocity');
      expect(preset).toHaveProperty('gravity');
      expect(preset).toHaveProperty('color');
      expect(preset).toHaveProperty('size');
      expect(preset).toHaveProperty('spread');
    }
  });
});

describe('createParticles', () => {
  const config: ParticleConfig = {
    count: 10,
    lifetime: 1.0,
    velocity: 2.0,
    gravity: -9.8,
    color: '#ffffff',
    size: 0.1,
    spread: 1.0,
  };

  it('returns ParticleState with positions array of length count*3', () => {
    const state = createParticles(config);
    expect(state.positions).toHaveLength(config.count * 3);
  });

  it('returns velocities array of length count*3', () => {
    const state = createParticles(config);
    expect(state.velocities).toHaveLength(config.count * 3);
  });

  it('returns lifetimes array of length count', () => {
    const state = createParticles(config);
    expect(state.lifetimes).toHaveLength(config.count);
  });

  it('initializes all lifetimes to config.lifetime', () => {
    const state = createParticles(config);
    for (const lt of state.lifetimes) {
      expect(lt).toBe(config.lifetime);
    }
  });

  it('initializes positions near origin (within spread)', () => {
    const state = createParticles(config);
    for (let i = 0; i < config.count * 3; i++) {
      expect(Math.abs(state.positions[i])).toBeLessThanOrEqual(config.spread);
    }
  });

  it('initializes velocities within velocity magnitude', () => {
    const state = createParticles(config);
    for (let i = 0; i < config.count; i++) {
      const vx = state.velocities[i * 3];
      const vy = state.velocities[i * 3 + 1];
      const vz = state.velocities[i * 3 + 2];
      const mag = Math.sqrt(vx * vx + vy * vy + vz * vz);
      expect(mag).toBeLessThanOrEqual(config.velocity * 1.5); // some tolerance for randomness
    }
  });
});

describe('updateParticles', () => {
  const config: ParticleConfig = {
    count: 3,
    lifetime: 1.0,
    velocity: 0,
    gravity: 10,
    color: '#ffffff',
    size: 0.1,
    spread: 0,
  };

  function makeState(): ParticleState {
    return {
      positions: new Float32Array([0, 1, 0, 0, 2, 0, 0, 3, 0]),
      velocities: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]),
      lifetimes: new Float32Array([1.0, 0.5, 0.1]),
    };
  }

  it('decreases lifetimes by delta', () => {
    const state = makeState();
    updateParticles(state, 0.1, config);
    expect(state.lifetimes[0]).toBeCloseTo(0.9);
    expect(state.lifetimes[1]).toBeCloseTo(0.4);
    expect(state.lifetimes[2]).toBeCloseTo(0.0);
  });

  it('applies gravity to Y velocity', () => {
    const state = makeState();
    updateParticles(state, 0.1, config);
    // vy += -gravity * delta = -10 * 0.1 = -1
    expect(state.velocities[1]).toBeCloseTo(-1);
    expect(state.velocities[4]).toBeCloseTo(-1);
  });

  it('updates positions by velocity * delta', () => {
    const state = makeState();
    // Set velocity for particle 0
    state.velocities[1] = 5; // vy = 5
    updateParticles(state, 0.1, config);
    // After gravity: vy = 5 + (-10*0.1) = 4
    // Position: y = 1 + 4*0.1 = 1.4
    expect(state.positions[1]).toBeCloseTo(1.4);
  });

  it('deactivates dead particles (lifetime <= 0) by zeroing position', () => {
    const state = makeState();
    state.lifetimes[2] = 0.05; // will die after 0.1 delta
    updateParticles(state, 0.1, config);
    // Particle 2 should be deactivated
    expect(state.positions[6]).toBe(0);
    expect(state.positions[7]).toBe(0);
    expect(state.positions[8]).toBe(0);
  });
});
