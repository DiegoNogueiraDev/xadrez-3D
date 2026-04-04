import { describe, it, expect } from 'vitest';
import { BOARD_MODEL_CONFIG, boardToWorld } from './boardModelConfig';

describe('BOARD_MODEL_CONFIG', () => {
  it('has squareSize of 1 (1 unit per square)', () => {
    expect(BOARD_MODEL_CONFIG.squareSize).toBe(1);
  });

  it('has boardSize = squareSize * 8', () => {
    expect(BOARD_MODEL_CONFIG.boardSize).toBe(BOARD_MODEL_CONFIG.squareSize * 8);
  });

  it('has borderWidth > 0', () => {
    expect(BOARD_MODEL_CONFIG.borderWidth).toBeGreaterThan(0);
  });

  it('has boardHeight > 0', () => {
    expect(BOARD_MODEL_CONFIG.boardHeight).toBeGreaterThan(0);
  });
});

describe('boardToWorld', () => {
  it('maps a1 (file=0, rank=0) to bottom-left corner', () => {
    const pos = boardToWorld(0, 0);
    expect(pos).toHaveLength(3);
    // a1 should be at negative x/z (bottom-left when centered)
    const half = (BOARD_MODEL_CONFIG.squareSize * 8) / 2;
    const expected = -half + BOARD_MODEL_CONFIG.squareSize / 2;
    expect(pos[0]).toBeCloseTo(expected);
    expect(pos[2]).toBeCloseTo(expected);
  });

  it('maps h8 (file=7, rank=7) to top-right corner', () => {
    const pos = boardToWorld(7, 7);
    const half = (BOARD_MODEL_CONFIG.squareSize * 8) / 2;
    const expected = half - BOARD_MODEL_CONFIG.squareSize / 2;
    expect(pos[0]).toBeCloseTo(expected);
    expect(pos[2]).toBeCloseTo(expected);
  });

  it('y position is at board surface height', () => {
    const pos = boardToWorld(0, 0);
    expect(pos[1]).toBe(BOARD_MODEL_CONFIG.boardHeight);
  });

  it('all 64 squares map to unique positions', () => {
    const positions = new Set<string>();
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        const pos = boardToWorld(file, rank);
        const key = `${pos[0].toFixed(2)},${pos[2].toFixed(2)}`;
        positions.add(key);
      }
    }
    expect(positions.size).toBe(64);
  });

  it('adjacent squares are exactly squareSize apart', () => {
    const a1 = boardToWorld(0, 0);
    const b1 = boardToWorld(1, 0);
    expect(b1[0] - a1[0]).toBeCloseTo(BOARD_MODEL_CONFIG.squareSize);
    expect(b1[2] - a1[2]).toBeCloseTo(0);
  });
});
