import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  CAPTURE_EFFECT_CONFIG,
  useCaptureEffect,
} from './captureEffect';
import { DEBRIS_PRESET, DUST_PRESET } from './particleSystem';

describe('CAPTURE_EFFECT_CONFIG', () => {
  it('has debris, flash, and dust configs', () => {
    expect(CAPTURE_EFFECT_CONFIG).toHaveProperty('debris');
    expect(CAPTURE_EFFECT_CONFIG).toHaveProperty('flash');
    expect(CAPTURE_EFFECT_CONFIG).toHaveProperty('dust');
  });

  it('debris config has count >= 15', () => {
    expect(CAPTURE_EFFECT_CONFIG.debris.count).toBeGreaterThanOrEqual(15);
  });

  it('dust config has count >= 20', () => {
    expect(CAPTURE_EFFECT_CONFIG.dust.count).toBeGreaterThanOrEqual(20);
  });

  it('flash config has color, intensity >= 3.0, and duration === 200', () => {
    expect(CAPTURE_EFFECT_CONFIG.flash.color).toBe('#ffffff');
    expect(CAPTURE_EFFECT_CONFIG.flash.intensity).toBeGreaterThanOrEqual(3.0);
    expect(CAPTURE_EFFECT_CONFIG.flash.duration).toBe(200);
  });

  it('debris uses brown color from DEBRIS_PRESET', () => {
    expect(CAPTURE_EFFECT_CONFIG.debris.color).toBe(DEBRIS_PRESET.color);
  });

  it('dust uses gray color from DUST_PRESET', () => {
    expect(CAPTURE_EFFECT_CONFIG.dust.color).toBe(DUST_PRESET.color);
  });
});

describe('useCaptureEffect', () => {
  it('returns trigger function and isActive state', () => {
    const { result } = renderHook(() => useCaptureEffect());
    expect(typeof result.current.trigger).toBe('function');
    expect(typeof result.current.isActive).toBe('boolean');
  });

  it('isActive is false by default', () => {
    const { result } = renderHook(() => useCaptureEffect());
    expect(result.current.isActive).toBe(false);
  });

  it('trigger() sets isActive to true', () => {
    const { result } = renderHook(() => useCaptureEffect());
    act(() => {
      result.current.trigger([0, 0, 0]);
    });
    expect(result.current.isActive).toBe(true);
  });

  it('stores the triggered position', () => {
    const { result } = renderHook(() => useCaptureEffect());
    act(() => {
      result.current.trigger([1, 2, 3]);
    });
    expect(result.current.position).toEqual([1, 2, 3]);
  });

  it('deactivate() sets isActive back to false', () => {
    const { result } = renderHook(() => useCaptureEffect());
    act(() => {
      result.current.trigger([0, 0, 0]);
    });
    act(() => {
      result.current.deactivate();
    });
    expect(result.current.isActive).toBe(false);
  });
});
