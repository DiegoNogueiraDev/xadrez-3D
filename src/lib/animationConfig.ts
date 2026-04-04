export type AnimationAction = 'idle' | 'capture' | 'promote';

export const ANIMATION_ACTIONS: AnimationAction[] = ['idle', 'capture', 'promote'];

export interface ActionConfig {
  name: string;
  frames: number;
}

export interface PieceAnimationConfig {
  actions: Record<AnimationAction, ActionConfig>;
}

const PIECE_NAMES = ['Pawn', 'Rook', 'Knight', 'Bishop', 'Queen', 'King'] as const;

function createPieceConfig(pieceName: string): PieceAnimationConfig {
  return {
    actions: {
      idle: { name: `${pieceName}_idle`, frames: 60 },
      capture: { name: `${pieceName}_capture`, frames: 30 },
      promote: { name: `${pieceName}_promote`, frames: 45 },
    },
  };
}

export const PIECE_ANIMATIONS: Record<string, PieceAnimationConfig> = Object.fromEntries(
  PIECE_NAMES.map((name) => [name, createPieceConfig(name)])
);
