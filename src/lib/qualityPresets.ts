import type { QualityPreset } from '../stores/useSettingsStore';

export type TextureResolution = '512' | '1024' | '2048';

export interface QualitySettings {
  shadows: boolean;
  particles: boolean;
  pixelRatio: number;
  antialias: boolean;
  shadowMapSize: number;
  particleCountMultiplier: number;
  textureResolution: TextureResolution;
}

export const QUALITY_PRESETS: Record<QualityPreset, QualitySettings> = {
  low: {
    shadows: false,
    particles: false,
    pixelRatio: 1,
    antialias: false,
    shadowMapSize: 512,
    particleCountMultiplier: 0,
    textureResolution: '512',
  },
  medium: {
    shadows: true,
    particles: true,
    pixelRatio: 1.5,
    antialias: true,
    shadowMapSize: 1024,
    particleCountMultiplier: 0.5,
    textureResolution: '1024',
  },
  high: {
    shadows: true,
    particles: true,
    pixelRatio: 2,
    antialias: true,
    shadowMapSize: 2048,
    particleCountMultiplier: 1,
    textureResolution: '2048',
  },
};

export function getQualitySettings(preset: QualityPreset): QualitySettings {
  return QUALITY_PRESETS[preset];
}
