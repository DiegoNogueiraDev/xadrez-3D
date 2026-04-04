import type { QualityPreset } from '../stores/useSettingsStore';
import { BOARD_MODEL_CONFIG } from './boardModelConfig';

export interface ContactShadowsConfig {
  enabled: boolean;
  opacity: number;
  blur: number;
  position: [number, number, number];
  width: number;
  height: number;
  far: number;
  resolution: number;
  frames: number;
}

export const CONTACT_SHADOWS_CONFIG: ContactShadowsConfig = {
  enabled: true,
  opacity: 0.5,
  blur: 2.5,
  position: [0, BOARD_MODEL_CONFIG.boardHeight + 0.01, 0],
  width: 10,
  height: 10,
  far: 5,
  resolution: 1024,
  frames: 1,
};

const RESOLUTION_MAP: Record<QualityPreset, number> = {
  low: 256,
  medium: 512,
  high: 1024,
};

export function getContactShadowsForQuality(
  quality: QualityPreset
): ContactShadowsConfig {
  return {
    ...CONTACT_SHADOWS_CONFIG,
    enabled: quality !== 'low',
    resolution: RESOLUTION_MAP[quality],
  };
}
