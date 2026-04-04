import { create } from 'zustand';
import { Chess, type Square, type PieceSymbol, type Color } from 'chess.js';

export type GamePhase = 'lobby' | 'loading' | 'playing' | 'ended';

export interface CapturedPiece {
  type: PieceSymbol;
  color: Color;
}

export interface BoardPiece {
  type: PieceSymbol;
  color: Color;
  square: Square;
}

interface GameState {
  // State
  chess: Chess;
  board: (BoardPiece | null)[][];
  turn: Color;
  selectedSquare: Square | null;
  legalMoves: string[];
  capturedPieces: { w: CapturedPiece[]; b: CapturedPiece[] };
  gamePhase: GamePhase;
  moveHistory: string[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  playerColor: Color;

  // Actions
  selectSquare: (square: string) => void;
  makeMove: (from: string, to: string, promotion?: PieceSymbol) => boolean;
  resetGame: () => void;
  setGamePhase: (phase: GamePhase) => void;
  setPlayerColor: (color: Color) => void;
}

function chessBoardToArray(chess: Chess): (BoardPiece | null)[][] {
  return chess.board().map((row) =>
    row.map((piece) =>
      piece ? { type: piece.type, color: piece.color, square: piece.square } : null,
    ),
  );
}

function createInitialState() {
  const chess = new Chess();
  return {
    chess,
    board: chessBoardToArray(chess),
    turn: 'w' as Color,
    selectedSquare: null as Square | null,
    legalMoves: [] as string[],
    capturedPieces: { w: [] as CapturedPiece[], b: [] as CapturedPiece[] },
    gamePhase: 'lobby' as GamePhase,
    moveHistory: [] as string[],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    playerColor: 'w' as Color,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  ...createInitialState(),

  selectSquare: (square: string) => {
    const { chess, selectedSquare, gamePhase } = get();
    if (gamePhase !== 'playing') return;

    const sq = square as Square;

    // Deselect if clicking same square
    if (selectedSquare === sq) {
      set({ selectedSquare: null, legalMoves: [] });
      return;
    }

    // If a piece is selected and clicking a legal move target, make the move
    if (selectedSquare) {
      const { legalMoves } = get();
      if (legalMoves.includes(sq)) {
        get().makeMove(selectedSquare, sq);
        return;
      }
    }

    // Try to select a piece
    const piece = chess.get(sq);
    if (piece && piece.color === chess.turn()) {
      const moves = chess.moves({ square: sq, verbose: true });
      set({
        selectedSquare: sq,
        legalMoves: moves.map((m) => m.to),
      });
    } else if (!selectedSquare) {
      // Clicking empty square with no selection — do nothing
      return;
    } else {
      // Clicking non-valid target — deselect
      set({ selectedSquare: null, legalMoves: [] });
    }
  },

  makeMove: (from: string, to: string, promotion?: PieceSymbol) => {
    const { chess, capturedPieces } = get();

    try {
      const move = chess.move({
        from: from as Square,
        to: to as Square,
        promotion: promotion || 'q',
      });

      if (!move) return false;

      // Track captured piece
      const newCaptured = { ...capturedPieces };
      if (move.captured) {
        // The capturing color gets the opponent's piece
        const capturedByColor = move.color;
        newCaptured[capturedByColor] = [
          ...newCaptured[capturedByColor],
          { type: move.captured, color: move.color === 'w' ? 'b' : 'w' },
        ];
      }

      set({
        board: chessBoardToArray(chess),
        turn: chess.turn(),
        selectedSquare: null,
        legalMoves: [],
        capturedPieces: newCaptured,
        moveHistory: [...get().moveHistory, move.san],
        isCheck: chess.isCheck(),
        isCheckmate: chess.isCheckmate(),
        isStalemate: chess.isStalemate(),
        gamePhase: chess.isGameOver() ? 'ended' : get().gamePhase,
      });

      return true;
    } catch {
      return false;
    }
  },

  resetGame: () => {
    set(createInitialState());
  },

  setGamePhase: (phase: GamePhase) => {
    set({ gamePhase: phase });
  },

  setPlayerColor: (color: Color) => {
    set({ playerColor: color });
  },
}));
