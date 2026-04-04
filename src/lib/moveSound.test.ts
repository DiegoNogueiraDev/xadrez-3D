import { describe, it, expect } from 'vitest';
import { getMoveSound } from './moveSound';
import type { SoundId } from './sounds';

// chess.js Move type subset we need
interface MoveInfo {
  captured?: string;
  san: string;
  flags: string;
}

describe('getMoveSound', () => {
  it('returns "move" for a normal pawn move', () => {
    const move: MoveInfo = { san: 'e4', flags: 'b' };
    expect(getMoveSound(move, false)).toBe('move');
  });

  it('returns "capture" for a capture move', () => {
    const move: MoveInfo = { san: 'exd5', flags: 'c', captured: 'p' };
    expect(getMoveSound(move, false)).toBe('capture');
  });

  it('returns "check" when move results in check (overrides capture)', () => {
    const move: MoveInfo = { san: 'Qxf7+', flags: 'c', captured: 'p' };
    expect(getMoveSound(move, true)).toBe('check');
  });

  it('returns "check" for non-capture check', () => {
    const move: MoveInfo = { san: 'Bb5+', flags: 'n' };
    expect(getMoveSound(move, true)).toBe('check');
  });

  it('returns "castle" for kingside castling', () => {
    const move: MoveInfo = { san: 'O-O', flags: 'k' };
    expect(getMoveSound(move, false)).toBe('castle');
  });

  it('returns "castle" for queenside castling', () => {
    const move: MoveInfo = { san: 'O-O-O', flags: 'q' };
    expect(getMoveSound(move, false)).toBe('castle');
  });

  it('returns "promote" for a promotion move', () => {
    const move: MoveInfo = { san: 'e8=Q', flags: 'p' };
    expect(getMoveSound(move, false)).toBe('promote');
  });

  it('returns "promote" for a capture-promotion', () => {
    const move: MoveInfo = { san: 'exd8=Q', flags: 'cp', captured: 'r' };
    expect(getMoveSound(move, false)).toBe('promote');
  });
});
