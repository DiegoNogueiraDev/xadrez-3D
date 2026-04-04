import { useState, useCallback } from 'react';
import { DEBRIS_PRESET, DUST_PRESET, type ParticleConfig } from './particleSystem';

export interface FlashConfig {
  color: string;
  intensity: number;
  duration: number;
}

export interface CaptureEffectConfig {
  debris: ParticleConfig;
  flash: FlashConfig;
  dust: ParticleConfig;
}

export const CAPTURE_EFFECT_CONFIG: CaptureEffectConfig = {
  debris: {
    ...DEBRIS_PRESET,
    count: 20,
  },
  flash: {
    color: '#ffffff',
    intensity: 3.0,
    duration: 200,
  },
  dust: {
    ...DUST_PRESET,
    count: 25,
  },
};

export function useCaptureEffect() {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  const trigger = useCallback((pos: [number, number, number]) => {
    setPosition(pos);
    setIsActive(true);
  }, []);

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  return { trigger, deactivate, isActive, position };
}
