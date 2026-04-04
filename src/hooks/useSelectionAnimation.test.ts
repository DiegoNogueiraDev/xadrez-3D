import { describe, it, expect, vi } from 'vitest';

// Mock @react-spring/three
const mockUseSpring = vi.fn();
vi.mock('@react-spring/three', () => ({
  useSpring: (props: Record<string, unknown>) => {
    mockUseSpring(props);
    return props;
  },
}));

import { useSelectionAnimation } from './useSelectionAnimation';
import { SELECTION_CONFIG } from '../lib/selectionConfig';

// Since we mock useSpring to return the raw props, we can test the config values
describe('useSelectionAnimation', () => {
  it('returns scale=1.05 and emissiveIntensity=0.3 when selected', () => {
    const result = useSelectionAnimation(true);
    expect(result.scale).toBe(SELECTION_CONFIG.scale);
    expect(result.emissiveIntensity).toBe(SELECTION_CONFIG.emissiveIntensity);
  });

  it('returns scale=1 and emissiveIntensity=0 when not selected', () => {
    const result = useSelectionAnimation(false);
    expect(result.scale).toBe(SELECTION_CONFIG.defaultScale);
    expect(result.emissiveIntensity).toBe(SELECTION_CONFIG.defaultEmissiveIntensity);
  });

  it('passes springConfig to useSpring', () => {
    useSelectionAnimation(true);
    expect(mockUseSpring).toHaveBeenCalledWith(
      expect.objectContaining({
        config: SELECTION_CONFIG.springConfig,
      })
    );
  });
});
