import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './useGameStore';

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  describe('initial state', () => {
    it('starts with white turn', () => {
      expect(useGameStore.getState().turn).toBe('w');
    });

    it('starts with no selected square', () => {
      expect(useGameStore.getState().selectedSquare).toBeNull();
    });

    it('starts with empty legal moves', () => {
      expect(useGameStore.getState().legalMoves).toEqual([]);
    });

    it('starts with empty captured pieces', () => {
      const { capturedPieces } = useGameStore.getState();
      expect(capturedPieces.w).toEqual([]);
      expect(capturedPieces.b).toEqual([]);
    });

    it('starts in lobby phase', () => {
      expect(useGameStore.getState().gamePhase).toBe('lobby');
    });

    it('has a board with 64 squares', () => {
      const { board } = useGameStore.getState();
      expect(board).toHaveLength(8);
      expect(board[0]).toHaveLength(8);
    });

    it('has initial chess position', () => {
      const { board } = useGameStore.getState();
      // White rook at a1 (row 7, col 0)
      expect(board[7][0]).toMatchObject({ type: 'r', color: 'w' });
      // Black king at e8 (row 0, col 4)
      expect(board[0][4]).toMatchObject({ type: 'k', color: 'b' });
    });
  });

  describe('selectSquare', () => {
    it('selects a square with own piece and shows legal moves', () => {
      useGameStore.getState().setGamePhase('playing');
      useGameStore.getState().selectSquare('e2');
      const state = useGameStore.getState();
      expect(state.selectedSquare).toBe('e2');
      expect(state.legalMoves.length).toBeGreaterThan(0);
      expect(state.legalMoves).toContain('e3');
      expect(state.legalMoves).toContain('e4');
    });

    it('deselects when clicking same square', () => {
      useGameStore.getState().setGamePhase('playing');
      useGameStore.getState().selectSquare('e2');
      useGameStore.getState().selectSquare('e2');
      expect(useGameStore.getState().selectedSquare).toBeNull();
      expect(useGameStore.getState().legalMoves).toEqual([]);
    });

    it('does nothing when selecting empty square without selection', () => {
      useGameStore.getState().setGamePhase('playing');
      useGameStore.getState().selectSquare('e4');
      expect(useGameStore.getState().selectedSquare).toBeNull();
    });
  });

  describe('makeMove', () => {
    it('makes a valid move and switches turn', () => {
      useGameStore.getState().setGamePhase('playing');
      const result = useGameStore.getState().makeMove('e2', 'e4');
      expect(result).toBe(true);
      expect(useGameStore.getState().turn).toBe('b');
    });

    it('rejects invalid move', () => {
      useGameStore.getState().setGamePhase('playing');
      const result = useGameStore.getState().makeMove('e2', 'e5');
      expect(result).toBe(false);
      expect(useGameStore.getState().turn).toBe('w');
    });

    it('clears selection after move', () => {
      useGameStore.getState().setGamePhase('playing');
      useGameStore.getState().selectSquare('e2');
      useGameStore.getState().makeMove('e2', 'e4');
      expect(useGameStore.getState().selectedSquare).toBeNull();
      expect(useGameStore.getState().legalMoves).toEqual([]);
    });

    it('tracks captured pieces', () => {
      useGameStore.getState().setGamePhase('playing');
      // Play moves to enable a capture
      useGameStore.getState().makeMove('e2', 'e4');
      useGameStore.getState().makeMove('d7', 'd5');
      useGameStore.getState().makeMove('e4', 'd5'); // capture
      expect(useGameStore.getState().capturedPieces.w.length).toBe(1);
      expect(useGameStore.getState().capturedPieces.w[0]).toMatchObject({ type: 'p', color: 'b' });
    });

    it('updates board after move', () => {
      useGameStore.getState().setGamePhase('playing');
      useGameStore.getState().makeMove('e2', 'e4');
      const { board } = useGameStore.getState();
      // e2 (row 6, col 4) should be empty
      expect(board[6][4]).toBeNull();
      // e4 (row 4, col 4) should have white pawn
      expect(board[4][4]).toMatchObject({ type: 'p', color: 'w' });
    });
  });

  describe('resetGame', () => {
    it('resets to initial state', () => {
      useGameStore.getState().setGamePhase('playing');
      useGameStore.getState().makeMove('e2', 'e4');
      useGameStore.getState().resetGame();
      expect(useGameStore.getState().turn).toBe('w');
      expect(useGameStore.getState().selectedSquare).toBeNull();
      expect(useGameStore.getState().gamePhase).toBe('lobby');
    });
  });

  describe('gamePhase', () => {
    it('transitions between phases', () => {
      useGameStore.getState().setGamePhase('loading');
      expect(useGameStore.getState().gamePhase).toBe('loading');
      useGameStore.getState().setGamePhase('playing');
      expect(useGameStore.getState().gamePhase).toBe('playing');
      useGameStore.getState().setGamePhase('ended');
      expect(useGameStore.getState().gamePhase).toBe('ended');
    });
  });
});
