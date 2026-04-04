export const BOARD_SIZE = 8;
export const SQUARE_SIZE = 1;
export const BOARD_OFFSET = (BOARD_SIZE * SQUARE_SIZE) / 2 - SQUARE_SIZE / 2;

export const COLORS = {
  lightSquare: 0xf0d9b5,
  darkSquare: 0xb58863,
  boardBorder: 0x5c3a1e,
  whitePiece: 0xf5f5dc,
  blackPiece: 0x2c2c2c,
  selectedHighlight: 0xffff00,
  validMoveIndicator: 0x00ff88,
  captureIndicator: 0xff4444,
  checkHighlight: 0xff0000,
  lastMoveHighlight: 0x88ccff,
  background: 0x1a1a2e,
};

export const PIECE_SCALE = 0.4;
export const PIECE_HEIGHT_OFFSET = 0.01;

export const INTERACTION_BOX_Y = 0.5;
export const INTERACTION_BOX_HEIGHT = 1.0;

export const ANIMATION = {
  moveDuration: 400,
  captureDuration: 300,
  liftHeight: 0.5,
};

export const CAMERA = {
  fov: 45,
  near: 0.1,
  far: 100,
  whitePosition: { x: 0, y: 8, z: 7 } as const,
  blackPosition: { x: 0, y: 8, z: -7 } as const,
  spectatorPosition: { x: 0, y: 12, z: 0 } as const,
  lookAt: { x: 0, y: 0, z: 0 } as const,
};

export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export const PIECE_NAMES: Record<PieceType, string> = {
  p: 'Peão',
  r: 'Torre',
  n: 'Cavalo',
  b: 'Bispo',
  q: 'Rainha',
  k: 'Rei',
};

export const PIECE_SYMBOLS: Record<string, string> = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
};
