import { describe, it, expect } from 'vitest';
import { HIGHLIGHT_COLORS, HIGHLIGHT_CONFIG, getHighlightSquares } from './highlightConfig';

describe('HIGHLIGHT_COLORS', () => {
  it('legalMove is green #00CC00', () => {
    expect(HIGHLIGHT_COLORS.legalMove).toBe('#00CC00');
  });

  it('selected is gold #FFD700', () => {
    expect(HIGHLIGHT_COLORS.selected).toBe('#FFD700');
  });

  it('lastMove is blue #4488FF', () => {
    expect(HIGHLIGHT_COLORS.lastMove).toBe('#4488FF');
  });

  it('check is red #FF2222', () => {
    expect(HIGHLIGHT_COLORS.check).toBe('#FF2222');
  });
});

describe('HIGHLIGHT_CONFIG', () => {
  it('has opacity between 0.3 and 0.6', () => {
    expect(HIGHLIGHT_CONFIG.opacity).toBeGreaterThanOrEqual(0.3);
    expect(HIGHLIGHT_CONFIG.opacity).toBeLessThanOrEqual(0.6);
  });

  it('has yOffset > 0', () => {
    expect(HIGHLIGHT_CONFIG.yOffset).toBeGreaterThan(0);
  });
});

describe('getHighlightSquares', () => {
  it('returns empty arrays with no selection', () => {
    const result = getHighlightSquares({
      selectedSquare: null,
      legalMoves: [],
      isCheck: false,
      lastMove: null,
    });
    expect(result.legalMoves).toEqual([]);
    expect(result.selectedSquare).toBeNull();
    expect(result.lastMove).toBeNull();
    expect(result.checkSquare).toBeNull();
  });

  it('returns legalMoves when piece is selected', () => {
    const result = getHighlightSquares({
      selectedSquare: 'e2',
      legalMoves: ['e3', 'e4'],
      isCheck: false,
      lastMove: null,
    });
    expect(result.selectedSquare).toBe('e2');
    expect(result.legalMoves).toEqual(['e3', 'e4']);
  });

  it('returns lastMove pair', () => {
    const result = getHighlightSquares({
      selectedSquare: null,
      legalMoves: [],
      isCheck: false,
      lastMove: { from: 'e2', to: 'e4' },
    });
    expect(result.lastMove).toEqual({ from: 'e2', to: 'e4' });
  });

  it('returns checkSquare when in check', () => {
    const result = getHighlightSquares({
      selectedSquare: null,
      legalMoves: [],
      isCheck: true,
      lastMove: null,
      kingSquare: 'e1',
    });
    expect(result.checkSquare).toBe('e1');
  });
});
