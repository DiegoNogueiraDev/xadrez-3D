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
    position: [5, 10, 5],
    intensity: 2.0,
    castShadow: true,
    shadowMapSize: 2048,
    color: '#FFF5E6',
  },
  fill: {
    position: [-5, 5, -5],
    intensity: 0.5,
    castShadow: false,
    shadowMapSize: 0,
    color: '#E6EEFF',
  },
  rim: {
    position: [0, 8, -8],
    intensity: 0.7,
    castShadow: false,
    shadowMapSize: 0,
    color: '#FFFFFF',
  },
  ambient: {
    intensity: 0.3,
    color: '#FFFFFF',
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
