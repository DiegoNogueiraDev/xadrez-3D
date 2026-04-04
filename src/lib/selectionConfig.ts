export interface SelectionConfig {
  scale: number;
  defaultScale: number;
  emissiveIntensity: number;
  defaultEmissiveIntensity: number;
  emissiveColor: string;
  springConfig: {
    tension: number;
    friction: number;
  };
}

export const SELECTION_CONFIG: SelectionConfig = {
  scale: 1.05,
  defaultScale: 1,
  emissiveIntensity: 0.3,
  defaultEmissiveIntensity: 0,
  emissiveColor: '#ffaa00',
  springConfig: {
    tension: 200,
    friction: 20,
  },
};
