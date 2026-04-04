import { useSpring } from '@react-spring/three';
import { SELECTION_CONFIG } from '../lib/selectionConfig';

export function useSelectionAnimation(isSelected: boolean) {
  const { scale, emissiveIntensity } = useSpring({
    scale: isSelected ? SELECTION_CONFIG.scale : SELECTION_CONFIG.defaultScale,
    emissiveIntensity: isSelected
      ? SELECTION_CONFIG.emissiveIntensity
      : SELECTION_CONFIG.defaultEmissiveIntensity,
    config: SELECTION_CONFIG.springConfig,
  });

  return { scale, emissiveIntensity };
}
