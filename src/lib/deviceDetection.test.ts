import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAutoQuality, type DeviceInfo } from './deviceDetection';

describe('getAutoQuality', () => {
  it('returns "low" for mobile devices', () => {
    const device: DeviceInfo = {
      isMobile: true,
      isTouchDevice: true,
      pixelRatio: 2,
      hardwareConcurrency: 4,
    };
    expect(getAutoQuality(device)).toBe('low');
  });

  it('returns "high" for high-end desktop (pixelRatio >= 2, cores >= 8)', () => {
    const device: DeviceInfo = {
      isMobile: false,
      isTouchDevice: false,
      pixelRatio: 2,
      hardwareConcurrency: 8,
    };
    expect(getAutoQuality(device)).toBe('high');
  });

  it('returns "medium" for low-end desktop', () => {
    const device: DeviceInfo = {
      isMobile: false,
      isTouchDevice: false,
      pixelRatio: 1,
      hardwareConcurrency: 4,
    };
    expect(getAutoQuality(device)).toBe('medium');
  });

  it('returns "medium" for desktop with high pixelRatio but low cores', () => {
    const device: DeviceInfo = {
      isMobile: false,
      isTouchDevice: false,
      pixelRatio: 2,
      hardwareConcurrency: 4,
    };
    expect(getAutoQuality(device)).toBe('medium');
  });
});

describe('DeviceInfo shape', () => {
  it('has all required fields', () => {
    const device: DeviceInfo = {
      isMobile: false,
      isTouchDevice: false,
      pixelRatio: 1,
      hardwareConcurrency: 4,
    };
    expect(device).toHaveProperty('isMobile');
    expect(device).toHaveProperty('isTouchDevice');
    expect(device).toHaveProperty('pixelRatio');
    expect(device).toHaveProperty('hardwareConcurrency');
  });
});
