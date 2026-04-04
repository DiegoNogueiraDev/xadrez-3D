import { useSpring } from '@react-spring/three';
import { useCallback } from 'react';
import { LANDING_CONFIG } from '../lib/landingConfig';

export function useLandingAnimation() {
  const [spring, api] = useSpring(() => ({
    rotationY: LANDING_CONFIG.defaultRotationY,
    scaleY: LANDING_CONFIG.defaultScaleY,
    config: LANDING_CONFIG.springConfig,
  }));

  const trigger = useCallback(() => {
    api.start({
      from: {
        rotationY: LANDING_CONFIG.wobbleRotation,
        scaleY: LANDING_CONFIG.squashScale,
      },
      to: async (next) => {
        await next({ scaleY: LANDING_CONFIG.stretchScale, rotationY: -LANDING_CONFIG.wobbleRotation / 2 });
        await next({ scaleY: LANDING_CONFIG.defaultScaleY, rotationY: LANDING_CONFIG.defaultRotationY });
      },
    });
  }, [api]);

  return {
    rotationY: spring.rotationY,
    scaleY: spring.scaleY,
    trigger,
  };
}
