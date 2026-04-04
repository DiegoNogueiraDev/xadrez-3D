import type { ParticleConfig, ParticleState } from './particleSystem';

export interface PromotionEffectConfig {
  dissolve: ParticleConfig;
  materialize: ParticleConfig;
  spawnRadius: number;
  timing: {
    dissolveDuration: number;
    materializeDuration: number;
  };
}

export const PROMOTION_EFFECT_CONFIG: PromotionEffectConfig = {
  dissolve: {
    count: 36,
    lifetime: 1.0,
    velocity: 2.0,
    gravity: -0.5,
    color: '#E8D5B5',
    size: 0.03,
    spread: 0.2,
  },
  materialize: {
    count: 36,
    lifetime: 1.0,
    velocity: 2.0,
    gravity: -0.3,
    color: '#FFD700',
    size: 0.03,
    spread: 0.2,
  },
  spawnRadius: 0.8,
  timing: {
    dissolveDuration: 600,
    materializeDuration: 800,
  },
};

export function createDissolveParticles(
  center: [number, number, number]
): ParticleState {
  const { dissolve, spawnRadius } = PROMOTION_EFFECT_CONFIG;
  const { count, lifetime, velocity } = dissolve;

  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const lifetimes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = (i / count) * Math.PI * 2;
    const r = Math.random() * spawnRadius * 0.3;

    // Start near center
    positions[i3] = center[0] + Math.cos(angle) * r;
    positions[i3 + 1] = center[1] + Math.random() * 0.5;
    positions[i3 + 2] = center[2] + Math.sin(angle) * r;

    // Outward velocities
    const speed = velocity * (0.5 + Math.random() * 0.5);
    velocities[i3] = Math.cos(angle) * speed;
    velocities[i3 + 1] = speed * 0.5;
    velocities[i3 + 2] = Math.sin(angle) * speed;

    lifetimes[i] = lifetime;
  }

  return { positions, velocities, lifetimes };
}

export function createMaterializeParticles(
  center: [number, number, number]
): ParticleState {
  const { materialize, spawnRadius } = PROMOTION_EFFECT_CONFIG;
  const { count, lifetime, velocity } = materialize;

  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const lifetimes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = (i / count) * Math.PI * 2;

    // Start at spawn radius
    positions[i3] = center[0] + Math.cos(angle) * spawnRadius;
    positions[i3 + 1] = center[1] + Math.random() * 0.5;
    positions[i3 + 2] = center[2] + Math.sin(angle) * spawnRadius;

    // Inward velocities toward center
    const speed = velocity * (0.5 + Math.random() * 0.5);
    velocities[i3] = -Math.cos(angle) * speed;
    velocities[i3 + 1] = speed * 0.3;
    velocities[i3 + 2] = -Math.sin(angle) * speed;

    lifetimes[i] = lifetime;
  }

  return { positions, velocities, lifetimes };
}
