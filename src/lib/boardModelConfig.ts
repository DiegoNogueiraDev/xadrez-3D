export interface BoardModelConfig {
  squareSize: number;
  boardSize: number;
  borderWidth: number;
  boardHeight: number;
}

export const BOARD_MODEL_CONFIG: BoardModelConfig = {
  squareSize: 1,
  boardSize: 8,
  borderWidth: 0.5,
  boardHeight: 0.2,
};

export function boardToWorld(
  file: number,
  rank: number
): [number, number, number] {
  const { squareSize, boardSize, boardHeight } = BOARD_MODEL_CONFIG;
  const halfBoard = (squareSize * boardSize) / 2;
  const x = -halfBoard + squareSize / 2 + file * squareSize;
  const z = -halfBoard + squareSize / 2 + rank * squareSize;
  return [x, boardHeight, z];
}
