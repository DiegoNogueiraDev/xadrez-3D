export interface IntroAnimationConfig {
  totalPieces: number;
  scaleFrom: number;
  scaleTo: number;
  staggerDelay: number;
  springConfig: {
    tension: number;
    friction: number;
  };
}

export const INTRO_ANIMATION_CONFIG: IntroAnimationConfig = {
  totalPieces: 32,
  scaleFrom: 0,
  scaleTo: 1,
  staggerDelay: 60,
  springConfig: {
    tension: 180,
    friction: 14,
  },
};

export function getIntroDelay(pieceIndex: number): number {
  return pieceIndex * INTRO_ANIMATION_CONFIG.staggerDelay;
}
