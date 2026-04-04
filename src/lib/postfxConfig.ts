import type { QualityPreset } from '../stores/useSettingsStore';

export interface BloomConfig {
  enabled: boolean;
  threshold: number;
  strength: number;
  radius: number;
}

export interface SSAOConfig {
  enabled: boolean;
  radius: number;
  intensity: number;
  luminanceInfluence: number;
}

export interface VignetteConfig {
  enabled: boolean;
  offset: number;
  darkness: number;
}

export interface PostFXSetup {
  bloom: BloomConfig;
  ssao: SSAOConfig;
  vignette: VignetteConfig;
}

export const POSTFX_CONFIG: PostFXSetup = {
  bloom: {
    enabled: true,
    threshold: 0.8,
    strength: 0.6,
    radius: 0.4,
  },
  ssao: {
    enabled: true,
    radius: 0.5,
    intensity: 1.5,
    luminanceInfluence: 0.6,
  },
  vignette: {
    enabled: true,
    offset: 0.3,
    darkness: 0.8,
  },
};

const QUALITY_PRESETS: Record<QualityPreset, { bloom: boolean; ssao: boolean; vignette: boolean }> = {
  low: { bloom: false, ssao: false, vignette: false },
  medium: { bloom: true, ssao: false, vignette: true },
  high: { bloom: true, ssao: true, vignette: true },
};

export function getPostFXForQuality(quality: QualityPreset): PostFXSetup {
  const flags = QUALITY_PRESETS[quality];
  return {
    bloom: { ...POSTFX_CONFIG.bloom, enabled: flags.bloom },
    ssao: { ...POSTFX_CONFIG.ssao, enabled: flags.ssao },
    vignette: { ...POSTFX_CONFIG.vignette, enabled: flags.vignette },
  };
}
