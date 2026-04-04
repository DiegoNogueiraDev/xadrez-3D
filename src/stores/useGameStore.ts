import { create } from 'zustand';
import { Chess, type Square, type PieceSymbol, type Color } from 'chess.js';
import { soundManager } from '../lib/sounds';
import { getMoveSound } from '../lib/moveSound';
import { networkManager } from '../network/NetworkManager';

export type GamePhase = 'lobby' | 'loading' | 'waiting' | 'playing' | 'ended';

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
  isOnline: boolean;

  // Actions
  selectSquare: (square: string) => void;
  makeMove: (from: string, to: string, promotion?: PieceSymbol) => boolean;
  applyRemoteMove: (from: string, to: string, promotion?: PieceSymbol) => boolean;
  resetGame: () => void;
  setGamePhase: (phase: GamePhase) => void;
  setPlayerColor: (color: Color) => void;
  setIsOnline: (online: boolean) => void;
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
    isOnline: false,
  };
}

function applyMoveToState(
  chess: Chess,
  from: string,
  to: string,
  capturedPieces: { w: CapturedPiece[]; b: CapturedPiece[] },
  moveHistory: string[],
  gamePhase: GamePhase,
  promotion?: PieceSymbol,
) {
  const move = chess.move({
    from: from as Square,
    to: to as Square,
    promotion: promotion || 'q',
  });

  if (!move) return null;

  const newCaptured = { ...capturedPieces };
  if (move.captured) {
    const capturedByColor = move.color;
    newCaptured[capturedByColor] = [
      ...newCaptured[capturedByColor],
      { type: move.captured, color: move.color === 'w' ? 'b' : 'w' },
    ];
  }

  const isCheck = chess.isCheck();

  return {
    board: chessBoardToArray(chess),
    turn: chess.turn(),
    selectedSquare: null as Square | null,
    legalMoves: [] as string[],
    capturedPieces: newCaptured,
    moveHistory: [...moveHistory, move.san],
    isCheck,
    isCheckmate: chess.isCheckmate(),
    isStalemate: chess.isStalemate(),
    gamePhase: chess.isGameOver() ? ('ended' as GamePhase) : gamePhase,
    _move: move,
    _isCheck: isCheck,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  ...createInitialState(),

  selectSquare: (square: string) => {
    const { chess, selectedSquare, gamePhase, isOnline, playerColor } = get();
    if (gamePhase !== 'playing') return;

    // In online mode, only allow selecting/moving your own pieces
    if (isOnline && chess.turn() !== playerColor) return;

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
      return;
    } else {
      set({ selectedSquare: null, legalMoves: [] });
    }
  },

  makeMove: (from: string, to: string, promotion?: PieceSymbol) => {
    const { chess, capturedPieces, moveHistory, gamePhase, isOnline } = get();

    try {
      const result = applyMoveToState(chess, from, to, capturedPieces, moveHistory, gamePhase, promotion);
      if (!result) return false;

      const { _move: move, _isCheck: isCheck, ...stateUpdate } = result;
      set(stateUpdate);

      // Play sound
      const soundId = getMoveSound(move, isCheck);
      soundManager.play(soundId);

      // Send over network if online
      if (isOnline) {
        networkManager.send({
          type: 'move',
          data: { from, to, promotion },
        });
      }

      return true;
    } catch {
      return false;
    }
  },

  applyRemoteMove: (from: string, to: string, promotion?: PieceSymbol) => {
    const { chess, capturedPieces, moveHistory, gamePhase } = get();

    try {
      const result = applyMoveToState(chess, from, to, capturedPieces, moveHistory, gamePhase, promotion);
      if (!result) return false;

      const { _move: move, _isCheck: isCheck, ...stateUpdate } = result;
      set(stateUpdate);

      const soundId = getMoveSound(move, isCheck);
      soundManager.play(soundId);

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

  setIsOnline: (online: boolean) => {
    set({ isOnline: online });
  },
}));
