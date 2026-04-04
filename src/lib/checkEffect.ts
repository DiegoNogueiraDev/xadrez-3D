import type { ParticleConfig, ParticleState } from './particleSystem';

export interface CameraShakeConfig {
  intensity: number;
  duration: number;
  decayRate: number;
}

export interface CheckEffectConfig {
  particleConfig: ParticleConfig;
  ringRadius: number;
  cameraShake: CameraShakeConfig;
}

export const CHECK_EFFECT_CONFIG: CheckEffectConfig = {
  particleConfig: {
    count: 24,
    lifetime: 1.5,
    velocity: 0.3,
    gravity: -0.3,
    color: '#ffd700',
    size: 0.025,
    spread: 0.1,
  },
  ringRadius: 0.6,
  cameraShake: {
    intensity: 0.03,
    duration: 300,
    decayRate: 5,
  },
};

export function createCheckParticles(
  center: [number, number, number]
): ParticleState {
  const { particleConfig, ringRadius } = CHECK_EFFECT_CONFIG;
  const { count, lifetime, velocity } = particleConfig;

  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const lifetimes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = (i / count) * Math.PI * 2;

    // Ring positions in XZ plane around center
    positions[i3] = center[0] + Math.cos(angle) * ringRadius;
    positions[i3 + 1] = center[1];
    positions[i3 + 2] = center[2] + Math.sin(angle) * ringRadius;

    // Upward velocity with slight outward drift
    velocities[i3] = Math.cos(angle) * velocity * 0.3;
    velocities[i3 + 1] = velocity;
    velocities[i3 + 2] = Math.sin(angle) * velocity * 0.3;

    lifetimes[i] = lifetime;
  }

  return { positions, velocities, lifetimes };
}
