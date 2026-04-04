import { describe, it, expect } from 'vitest';
import { PIECE_UNICODE, getPieceUnicode } from './pieceUnicode';

describe('PIECE_UNICODE', () => {
  it('has all 12 mappings (6 pieces x 2 colors)', () => {
    const keys = Object.keys(PIECE_UNICODE);
    expect(keys.length).toBe(12);
  });

  it('white pawn is ♙', () => {
    expect(PIECE_UNICODE['p-w']).toBe('♙');
  });

  it('black king is ♚', () => {
    expect(PIECE_UNICODE['k-b']).toBe('♚');
  });

  it('white queen is ♕', () => {
    expect(PIECE_UNICODE['q-w']).toBe('♕');
  });
});

describe('getPieceUnicode', () => {
  it('returns correct unicode for piece+color', () => {
    expect(getPieceUnicode('p', 'w')).toBe(PIECE_UNICODE['p-w']);
    expect(getPieceUnicode('r', 'b')).toBe('♜');
    expect(getPieceUnicode('n', 'w')).toBe('♘');
  });
});
