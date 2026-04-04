import { describe, it, expect } from 'vitest';
import { TABLE_SURFACE_CONFIG } from './tableSurfaceConfig';
import { BOARD_MODEL_CONFIG } from './boardModelConfig';

describe('TABLE_SURFACE_CONFIG', () => {
  it('has size larger than board + border', () => {
    const minSize = BOARD_MODEL_CONFIG.boardSize + BOARD_MODEL_CONFIG.borderWidth * 2;
    expect(TABLE_SURFACE_CONFIG.size).toBeGreaterThanOrEqual(minSize);
  });

  it('has position.y below board height', () => {
    expect(TABLE_SURFACE_CONFIG.position[1]).toBeLessThan(BOARD_MODEL_CONFIG.boardHeight);
  });

  it('has dark wood color #1A0E06 for medieval table', () => {
    expect(TABLE_SURFACE_CONFIG.color).toBe('#1A0E06');
  });

  it('has roughness 0.75 for wood appearance', () => {
    expect(TABLE_SURFACE_CONFIG.roughness).toBe(0.75);
  });

  it('has materialType as wood', () => {
    expect(TABLE_SURFACE_CONFIG.materialType).toBe('wood');
  });

  it('has metalness close to 0 for non-metallic surface', () => {
    expect(TABLE_SURFACE_CONFIG.metalness).toBeLessThanOrEqual(0.05);
  });
});
