import type { ParticleConfig, ParticleState } from './particleSystem';

export const DUST_PUFF_CONFIG: ParticleConfig = {
  count: 20,
  lifetime: 0.35,
  velocity: 1.2,
  gravity: -0.5,
  color: '#AAAAAA',
  size: 0.03,
  spread: 0.15,
};

export function createDustPuff(
  center: [number, number, number]
): ParticleState {
  const { count, lifetime, velocity, spread } = DUST_PUFF_CONFIG;

  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const lifetimes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = (i / count) * Math.PI * 2;
    const r = Math.random() * spread;

    positions[i3] = center[0] + Math.cos(angle) * r;
    positions[i3 + 1] = center[1];
    positions[i3 + 2] = center[2] + Math.sin(angle) * r;

    const speed = velocity * (0.3 + Math.random() * 0.7);
    velocities[i3] = Math.cos(angle) * speed * 0.6;
    velocities[i3 + 1] = speed * 0.4 + Math.random() * 0.3;
    velocities[i3 + 2] = Math.sin(angle) * speed * 0.6;

    lifetimes[i] = lifetime;
  }

  return { positions, velocities, lifetimes };
}
