import { useSpring } from '@react-spring/three';
import { useState, useCallback } from 'react';

export interface PieceAnimationConfig {
  arcHeight?: number;
  duration?: number;
}

export function computeArcPosition(
  from: [number, number, number],
  to: [number, number, number],
  t: number,
  arcHeight: number
): [number, number, number] {
  const x = from[0] + (to[0] - from[0]) * t;
  const baseY = from[1] + (to[1] - from[1]) * t;
  const arcY = 4 * arcHeight * t * (1 - t);
  const y = baseY + arcY;
  const z = from[2] + (to[2] - from[2]) * t;
  return [x, y, z];
}

export function usePieceAnimation(
  from: [number, number, number],
  to: [number, number, number],
  config: PieceAnimationConfig = {}
) {
  const { arcHeight = 2, duration = 500 } = config;
  const [isAnimating, setIsAnimating] = useState(false);

  const [spring, api] = useSpring(() => ({
    t: 1,
    config: { duration },
  }));

  const trigger = useCallback(() => {
    setIsAnimating(true);
    api.start({
      from: { t: 0 },
      to: { t: 1 },
      config: { duration },
      onRest: () => setIsAnimating(false),
    });
  }, [api, duration]);

  const position = spring.t.to((t: number) =>
    computeArcPosition(from, to, t, arcHeight)
  );

  return { position, isAnimating, trigger };
}
