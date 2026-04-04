export const HIGHLIGHT_COLORS = {
  legalMove: '#00CC00',
  selected: '#FFD700',
  lastMove: '#4488FF',
  check: '#FF2222',
} as const;

export const HIGHLIGHT_CONFIG = {
  opacity: 0.4,
  yOffset: 0.01,
} as const;

export interface HighlightState {
  selectedSquare: string | null;
  legalMoves: string[];
  isCheck: boolean;
  lastMove: { from: string; to: string } | null;
  kingSquare?: string;
}

export interface HighlightSquares {
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  checkSquare: string | null;
}

export function getHighlightSquares(state: HighlightState): HighlightSquares {
  return {
    selectedSquare: state.selectedSquare,
    legalMoves: state.legalMoves,
    lastMove: state.lastMove,
    checkSquare: state.isCheck && state.kingSquare ? state.kingSquare : null,
  };
}
