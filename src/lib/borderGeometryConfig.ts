import { BOARD_MODEL_CONFIG } from './boardModelConfig';

export interface BorderGeometryConfig {
  innerSize: number;
  outerSize: number;
  height: number;
  bevelRadius: number;
  bevelSegments: number;
}

export const BORDER_GEOMETRY_CONFIG: BorderGeometryConfig = {
  innerSize: BOARD_MODEL_CONFIG.boardSize,
  outerSize: BOARD_MODEL_CONFIG.boardSize + 2 * BOARD_MODEL_CONFIG.borderWidth,
  height: BOARD_MODEL_CONFIG.boardHeight,
  bevelRadius: 0.05,
  bevelSegments: 3,
};
