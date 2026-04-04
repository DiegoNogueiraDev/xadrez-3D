import { describe, it, expect } from 'vitest';
import { CASTLING_CONFIG, getCastlingSquares, isCastlingMove } from './castlingConfig';

describe('CASTLING_CONFIG', () => {
  it('has timing with kingDelay=0 and rookDelay > 0', () => {
    expect(CASTLING_CONFIG.timing.kingDelay).toBe(0);
    expect(CASTLING_CONFIG.timing.rookDelay).toBeGreaterThan(0);
  });

  it('has timing duration > 0', () => {
    expect(CASTLING_CONFIG.timing.duration).toBeGreaterThan(0);
  });
});

describe('getCastlingSquares', () => {
  it('returns white kingside castling squares (e1→g1)', () => {
    const result = getCastlingSquares('e1', 'g1');
    expect(result).toEqual({
      kingFrom: 'e1',
      kingTo: 'g1',
      rookFrom: 'h1',
      rookTo: 'f1',
    });
  });

  it('returns white queenside castling squares (e1→c1)', () => {
    const result = getCastlingSquares('e1', 'c1');
    expect(result).toEqual({
      kingFrom: 'e1',
      kingTo: 'c1',
      rookFrom: 'a1',
      rookTo: 'd1',
    });
  });

  it('returns black kingside castling squares (e8→g8)', () => {
    const result = getCastlingSquares('e8', 'g8');
    expect(result).toEqual({
      kingFrom: 'e8',
      kingTo: 'g8',
      rookFrom: 'h8',
      rookTo: 'f8',
    });
  });

  it('returns black queenside castling squares (e8→c8)', () => {
    const result = getCastlingSquares('e8', 'c8');
    expect(result).toEqual({
      kingFrom: 'e8',
      kingTo: 'c8',
      rookFrom: 'a8',
      rookTo: 'd8',
    });
  });

  it('returns null for non-castling moves', () => {
    expect(getCastlingSquares('e2', 'e4')).toBeNull();
    expect(getCastlingSquares('d1', 'h5')).toBeNull();
    expect(getCastlingSquares('e1', 'f1')).toBeNull();
  });
});

describe('isCastlingMove', () => {
  it('returns true for all 4 castling moves', () => {
    expect(isCastlingMove('e1', 'g1')).toBe(true);
    expect(isCastlingMove('e1', 'c1')).toBe(true);
    expect(isCastlingMove('e8', 'g8')).toBe(true);
    expect(isCastlingMove('e8', 'c8')).toBe(true);
  });

  it('returns false for non-castling moves', () => {
    expect(isCastlingMove('e2', 'e4')).toBe(false);
    expect(isCastlingMove('e1', 'f1')).toBe(false);
    expect(isCastlingMove('e1', 'e2')).toBe(false);
  });
});
