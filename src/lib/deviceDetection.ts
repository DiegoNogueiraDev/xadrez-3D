import type { QualityPreset } from '../stores/useSettingsStore';

export interface DeviceInfo {
  isMobile: boolean;
  isTouchDevice: boolean;
  pixelRatio: number;
  hardwareConcurrency: number;
}

export function detectDevice(): DeviceInfo {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobile =
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    (typeof window !== 'undefined' && window.innerWidth <= 768);
  const isTouchDevice =
    (typeof window !== 'undefined' && 'ontouchstart' in window) ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  const hardwareConcurrency =
    typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;

  return { isMobile, isTouchDevice, pixelRatio, hardwareConcurrency };
}

export function getAutoQuality(device: DeviceInfo): QualityPreset {
  if (device.isMobile) return 'low';
  if (device.pixelRatio >= 2 && device.hardwareConcurrency >= 8) return 'high';
  return 'medium';
}
