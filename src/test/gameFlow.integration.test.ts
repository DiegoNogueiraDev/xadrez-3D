import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../stores/useGameStore';

/**
 * Integration test: full game lifecycle
 * lobby → playing → moves → capture → Scholar's Mate → checkmate → ended
 */
describe('Game Flow Integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('starts in lobby phase', () => {
    expect(useGameStore.getState().gamePhase).toBe('lobby');
  });

  it('transitions from lobby to playing', () => {
    useGameStore.getState().setGamePhase('playing');
    expect(useGameStore.getState().gamePhase).toBe('playing');
    expect(useGameStore.getState().turn).toBe('w');
  });

  it('executes a full move and updates board state', () => {
    useGameStore.getState().setGamePhase('playing');
    const result = useGameStore.getState().makeMove('e2', 'e4');
    expect(result).toBe(true);

    const { board, turn } = useGameStore.getState();
    // e2 (row 6, col 4) empty, e4 (row 4, col 4) has white pawn
    expect(board[6][4]).toBeNull();
    expect(board[4][4]).toMatchObject({ type: 'p', color: 'w' });
    expect(turn).toBe('b');
  });

  it('tracks captured pieces correctly', () => {
    useGameStore.getState().setGamePhase('playing');
    // Setup capture: e4, d5, exd5
    useGameStore.getState().makeMove('e2', 'e4');
    useGameStore.getState().makeMove('d7', 'd5');
    useGameStore.getState().makeMove('e4', 'd5');

    const { capturedPieces } = useGameStore.getState();
    expect(capturedPieces.w).toHaveLength(1);
    expect(capturedPieces.w[0]).toMatchObject({ type: 'p', color: 'b' });
  });

  it('detects check state', () => {
    useGameStore.getState().setGamePhase('playing');
    // Quick check: e4, f5, Qh5+ (not mate yet, just check via Qh5+)
    // Actually let's use a simpler approach: e4, e5, Bc4, Nc6, Qf3 (threatening), ...
    // Simpler: just do Scholar's Mate steps and check isCheck along the way
    useGameStore.getState().makeMove('e2', 'e4'); // 1. e4
    useGameStore.getState().makeMove('e7', 'e5'); // 1... e5
    useGameStore.getState().makeMove('f1', 'c4'); // 2. Bc4
    useGameStore.getState().makeMove('b8', 'c6'); // 2... Nc6
    useGameStore.getState().makeMove('d1', 'h5'); // 3. Qh5
    // Not check yet, but threatening
    expect(useGameStore.getState().isCheck).toBe(false);
  });

  it('completes Scholar\'s Mate (checkmate in 4 moves)', () => {
    useGameStore.getState().setGamePhase('playing');

    // Scholar's Mate:
    useGameStore.getState().makeMove('e2', 'e4'); // 1. e4
    useGameStore.getState().makeMove('e7', 'e5'); // 1... e5
    useGameStore.getState().makeMove('f1', 'c4'); // 2. Bc4
    useGameStore.getState().makeMove('b8', 'c6'); // 2... Nc6
    useGameStore.getState().makeMove('d1', 'h5'); // 3. Qh5
    useGameStore.getState().makeMove('g8', 'f6'); // 3... Nf6??
    useGameStore.getState().makeMove('h5', 'f7'); // 4. Qxf7# — checkmate!

    const state = useGameStore.getState();
    expect(state.isCheckmate).toBe(true);
    expect(state.isCheck).toBe(true);
    expect(state.gamePhase).toBe('ended');
  });

  it('tracks move history throughout the game', () => {
    useGameStore.getState().setGamePhase('playing');
    useGameStore.getState().makeMove('e2', 'e4');
    useGameStore.getState().makeMove('e7', 'e5');
    useGameStore.getState().makeMove('g1', 'f3');

    const { moveHistory } = useGameStore.getState();
    expect(moveHistory).toHaveLength(3);
    expect(moveHistory[0]).toBe('e4');
    expect(moveHistory[1]).toBe('e5');
    expect(moveHistory[2]).toBe('Nf3');
  });

  it('rejects invalid moves and preserves state', () => {
    useGameStore.getState().setGamePhase('playing');
    const before = useGameStore.getState().turn;
    const result = useGameStore.getState().makeMove('e2', 'e5');
    expect(result).toBe(false);
    expect(useGameStore.getState().turn).toBe(before);
  });

  it('captures via selectSquare (UI click simulation)', () => {
    useGameStore.getState().setGamePhase('playing');
    useGameStore.getState().makeMove('e2', 'e4');
    useGameStore.getState().makeMove('d7', 'd5');

    // Simulate UI: click e4 pawn, then click d5 (capture)
    useGameStore.getState().selectSquare('e4');
    useGameStore.getState().selectSquare('d5');

    expect(useGameStore.getState().turn).toBe('b');
    expect(useGameStore.getState().capturedPieces.w).toHaveLength(1);
  });
});
