import { describe, it, expect } from 'vitest';
import { PIECE_SOUND_CONFIG, getPieceSoundOptions } from './pieceSoundConfig';
import type { PieceSymbol } from 'chess.js';

const ALL_PIECES: PieceSymbol[] = ['p', 'r', 'n', 'b', 'q', 'k'];

describe('PIECE_SOUND_CONFIG', () => {
  it('has all 6 piece types mapped', () => {
    for (const piece of ALL_PIECES) {
      expect(PIECE_SOUND_CONFIG[piece]).toBeDefined();
    }
  });

  it('knight has rate 1.2-1.5 and volume 0.7-1.0', () => {
    expect(PIECE_SOUND_CONFIG.n.rate).toBeGreaterThanOrEqual(1.2);
    expect(PIECE_SOUND_CONFIG.n.rate).toBeLessThanOrEqual(1.5);
    expect(PIECE_SOUND_CONFIG.n.volume).toBeGreaterThanOrEqual(0.7);
    expect(PIECE_SOUND_CONFIG.n.volume).toBeLessThanOrEqual(1.0);
  });

  it('rook has rate 0.7-0.9 and volume 0.8-1.0', () => {
    expect(PIECE_SOUND_CONFIG.r.rate).toBeGreaterThanOrEqual(0.7);
    expect(PIECE_SOUND_CONFIG.r.rate).toBeLessThanOrEqual(0.9);
    expect(PIECE_SOUND_CONFIG.r.volume).toBeGreaterThanOrEqual(0.8);
  });

  it('bishop has rate 1.0-1.2 and volume 0.5-0.8', () => {
    expect(PIECE_SOUND_CONFIG.b.rate).toBeGreaterThanOrEqual(1.0);
    expect(PIECE_SOUND_CONFIG.b.rate).toBeLessThanOrEqual(1.2);
    expect(PIECE_SOUND_CONFIG.b.volume).toBeLessThanOrEqual(0.8);
  });

  it('queen has rate 0.9-1.1 and volume 0.9-1.0', () => {
    expect(PIECE_SOUND_CONFIG.q.rate).toBeGreaterThanOrEqual(0.9);
    expect(PIECE_SOUND_CONFIG.q.rate).toBeLessThanOrEqual(1.1);
    expect(PIECE_SOUND_CONFIG.q.volume).toBeGreaterThanOrEqual(0.9);
  });

  it('king has rate 0.6-0.8 and volume 0.9-1.0', () => {
    expect(PIECE_SOUND_CONFIG.k.rate).toBeGreaterThanOrEqual(0.6);
    expect(PIECE_SOUND_CONFIG.k.rate).toBeLessThanOrEqual(0.8);
    expect(PIECE_SOUND_CONFIG.k.volume).toBeGreaterThanOrEqual(0.9);
  });

  it('pawn has rate 1.0-1.3 and volume 0.5-0.7', () => {
    expect(PIECE_SOUND_CONFIG.p.rate).toBeGreaterThanOrEqual(1.0);
    expect(PIECE_SOUND_CONFIG.p.rate).toBeLessThanOrEqual(1.3);
    expect(PIECE_SOUND_CONFIG.p.volume).toBeLessThanOrEqual(0.7);
  });
});

describe('getPieceSoundOptions', () => {
  it('returns correct options for each piece', () => {
    for (const piece of ALL_PIECES) {
      const options = getPieceSoundOptions(piece);
      expect(options.rate).toBe(PIECE_SOUND_CONFIG[piece].rate);
      expect(options.volume).toBe(PIECE_SOUND_CONFIG[piece].volume);
    }
  });
});
