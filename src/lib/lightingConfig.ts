import type { QualityPreset } from '../stores/useSettingsStore';

export interface LightConfig {
  position: [number, number, number];
  intensity: number;
  castShadow: boolean;
  shadowMapSize: number;
  color?: string;
}

export interface AmbientConfig {
  intensity: number;
  color?: string;
}

export interface LightingSetup {
  key: LightConfig;
  fill: LightConfig;
  rim: LightConfig;
  ambient: AmbientConfig;
}

export const LIGHTING_CONFIG: LightingSetup = {
  key: {
    position: [4, 8, 3],
    intensity: 0.8,
    castShadow: true,
    shadowMapSize: 2048,
    color: '#FFD49E',
  },
  fill: {
    position: [-4, 4, -4],
    intensity: 0.2,
    castShadow: false,
    shadowMapSize: 0,
    color: '#8090B0',
  },
  rim: {
    position: [0, 6, -6],
    intensity: 0.3,
    castShadow: false,
    shadowMapSize: 0,
    color: '#A0A0C0',
  },
  ambient: {
    intensity: 0.15,
    color: '#E8DDD0',
  },
};

const SHADOW_MAP_SIZES: Record<QualityPreset, number> = {
  low: 0,
  medium: 1024,
  high: 2048,
};

export function getLightingForQuality(quality: QualityPreset): LightingSetup {
  const shadowMapSize = SHADOW_MAP_SIZES[quality];
  const castShadow = quality !== 'low';

  return {
    ...LIGHTING_CONFIG,
    key: {
      ...LIGHTING_CONFIG.key,
      castShadow,
      shadowMapSize,
    },
  };
}
