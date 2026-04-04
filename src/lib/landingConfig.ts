export interface LandingConfig {
  wobbleRotation: number;
  squashScale: number;
  stretchScale: number;
  defaultRotationY: number;
  defaultScaleY: number;
  springConfig: {
    tension: number;
    friction: number;
  };
}

export const LANDING_CONFIG: LandingConfig = {
  wobbleRotation: 0.08,
  squashScale: 0.85,
  stretchScale: 1.1,
  defaultRotationY: 0,
  defaultScaleY: 1,
  springConfig: {
    tension: 300,
    friction: 10,
  },
};
