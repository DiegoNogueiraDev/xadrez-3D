import type { QualityPreset } from '../stores/useSettingsStore';

export interface QualitySettings {
  shadows: boolean;
  particles: boolean;
  pixelRatio: number;
  antialias: boolean;
  shadowMapSize: number;
}

export const QUALITY_PRESETS: Record<QualityPreset, QualitySettings> = {
  low: {
    shadows: false,
    particles: false,
    pixelRatio: 1,
    antialias: false,
    shadowMapSize: 512,
  },
  medium: {
    shadows: true,
    particles: true,
    pixelRatio: 1.5,
    antialias: true,
    shadowMapSize: 1024,
  },
  high: {
    shadows: true,
    particles: true,
    pixelRatio: 2,
    antialias: true,
    shadowMapSize: 2048,
  },
};

export function getQualitySettings(preset: QualityPreset): QualitySettings {
  return QUALITY_PRESETS[preset];
}
