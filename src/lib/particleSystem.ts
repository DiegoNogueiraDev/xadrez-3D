export interface ParticleConfig {
  count: number;
  lifetime: number;
  velocity: number;
  gravity: number;
  color: string;
  size: number;
  spread: number;
}

export interface ParticleState {
  positions: Float32Array;
  velocities: Float32Array;
  lifetimes: Float32Array;
}

export const DUST_PRESET: ParticleConfig = {
  count: 30,
  lifetime: 0.8,
  velocity: 1.0,
  gravity: -2,
  color: '#888888',
  size: 0.03,
  spread: 0.3,
};

export const SPARKLE_PRESET: ParticleConfig = {
  count: 40,
  lifetime: 1.2,
  velocity: 1.5,
  gravity: -0.5, // negative = slight upward drift effect
  color: '#ffd700',
  size: 0.02,
  spread: 0.5,
};

export const DEBRIS_PRESET: ParticleConfig = {
  count: 20,
  lifetime: 0.6,
  velocity: 4.0,
  gravity: 9.8,
  color: '#8b4513',
  size: 0.08,
  spread: 0.2,
};

export function createParticles(config: ParticleConfig): ParticleState {
  const { count, lifetime, velocity, spread } = config;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const lifetimes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Random position within spread
    positions[i3] = (Math.random() - 0.5) * 2 * spread;
    positions[i3 + 1] = (Math.random() - 0.5) * 2 * spread;
    positions[i3 + 2] = (Math.random() - 0.5) * 2 * spread;

    // Random velocity direction
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const speed = Math.random() * velocity;
    velocities[i3] = speed * Math.sin(phi) * Math.cos(theta);
    velocities[i3 + 1] = speed * Math.cos(phi);
    velocities[i3 + 2] = speed * Math.sin(phi) * Math.sin(theta);

    lifetimes[i] = lifetime;
  }

  return { positions, velocities, lifetimes };
}

export function updateParticles(
  state: ParticleState,
  delta: number,
  config: ParticleConfig
): void {
  const { count, gravity } = config;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Decrease lifetime
    state.lifetimes[i] -= delta;

    if (state.lifetimes[i] <= 0) {
      // Deactivate dead particle
      state.lifetimes[i] = 0;
      state.positions[i3] = 0;
      state.positions[i3 + 1] = 0;
      state.positions[i3 + 2] = 0;
      state.velocities[i3] = 0;
      state.velocities[i3 + 1] = 0;
      state.velocities[i3 + 2] = 0;
      continue;
    }

    // Apply gravity to Y velocity
    state.velocities[i3 + 1] += -gravity * delta;

    // Update positions
    state.positions[i3] += state.velocities[i3] * delta;
    state.positions[i3 + 1] += state.velocities[i3 + 1] * delta;
    state.positions[i3 + 2] += state.velocities[i3 + 2] * delta;
  }
}
