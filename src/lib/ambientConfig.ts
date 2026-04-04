import type { SoundId } from './sounds';

export interface AmbientSoundConfig {
  soundId: SoundId;
  volume: number;
  fadeInDuration: number;
  loop: boolean;
  optional?: boolean;
}

export interface AmbientConfig {
  room: AmbientSoundConfig;
  clock: AmbientSoundConfig;
}

export const AMBIENT_CONFIG: AmbientConfig = {
  room: {
    soundId: 'ambient',
    volume: 0.15,
    fadeInDuration: 3000,
    loop: true,
  },
  clock: {
    soundId: 'ambient',
    volume: 0.08,
    fadeInDuration: 2000,
    loop: true,
    optional: true,
  },
};
