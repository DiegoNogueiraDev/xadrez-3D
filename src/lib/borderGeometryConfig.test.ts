import { describe, it, expect } from 'vitest';
import { BORDER_GEOMETRY_CONFIG } from './borderGeometryConfig';
import { BOARD_MODEL_CONFIG } from './boardModelConfig';
import { BOARD_BORDER } from './boardMaterials';
import { TEXTURE_SETS } from './textures';

describe('BORDER_GEOMETRY_CONFIG', () => {
  it('innerSize matches board size', () => {
    expect(BORDER_GEOMETRY_CONFIG.innerSize).toBe(BOARD_MODEL_CONFIG.boardSize);
  });

  it('outerSize = innerSize + 2 * borderWidth', () => {
    const expected = BOARD_MODEL_CONFIG.boardSize + 2 * BOARD_MODEL_CONFIG.borderWidth;
    expect(BORDER_GEOMETRY_CONFIG.outerSize).toBe(expected);
  });

  it('height matches board height', () => {
    expect(BORDER_GEOMETRY_CONFIG.height).toBe(BOARD_MODEL_CONFIG.boardHeight);
  });

  it('bevelRadius > 0', () => {
    expect(BORDER_GEOMETRY_CONFIG.bevelRadius).toBeGreaterThan(0);
  });

  it('bevelSegments >= 2', () => {
    expect(BORDER_GEOMETRY_CONFIG.bevelSegments).toBeGreaterThanOrEqual(2);
  });

  it('outerSize > innerSize', () => {
    expect(BORDER_GEOMETRY_CONFIG.outerSize).toBeGreaterThan(BORDER_GEOMETRY_CONFIG.innerSize);
  });
});

describe('BOARD_BORDER material', () => {
  it('references wood texture set', () => {
    expect(BOARD_BORDER.textureSet).toBe(TEXTURE_SETS.wood);
  });
});
