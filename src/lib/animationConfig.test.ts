import { describe, it, expect } from 'vitest';
import {
  ANIMATION_ACTIONS,
  PIECE_ANIMATIONS,
  type AnimationAction,
  type PieceAnimationConfig,
} from './animationConfig';

const PIECE_NAMES = ['Pawn', 'Rook', 'Knight', 'Bishop', 'Queen', 'King'];
const ACTION_NAMES: AnimationAction[] = ['idle', 'capture', 'promote'];

describe('ANIMATION_ACTIONS', () => {
  it('exports exactly 3 action types: idle, capture, promote', () => {
    expect(ANIMATION_ACTIONS).toHaveLength(3);
    expect(ANIMATION_ACTIONS).toContain('idle');
    expect(ANIMATION_ACTIONS).toContain('capture');
    expect(ANIMATION_ACTIONS).toContain('promote');
  });
});

describe('PIECE_ANIMATIONS', () => {
  it('has entries for all 6 piece types', () => {
    expect(Object.keys(PIECE_ANIMATIONS)).toHaveLength(6);
    for (const name of PIECE_NAMES) {
      expect(PIECE_ANIMATIONS).toHaveProperty(name);
    }
  });

  it('each piece has all 3 animation actions configured', () => {
    for (const [pieceName, config] of Object.entries(PIECE_ANIMATIONS)) {
      for (const action of ACTION_NAMES) {
        expect(config.actions).toHaveProperty(action);
        expect(typeof config.actions[action].name).toBe('string');
        expect(typeof config.actions[action].frames).toBe('number');
        expect(config.actions[action].frames).toBeGreaterThan(0);
      }
    }
  });

  it('idle animations have 60 frames', () => {
    for (const config of Object.values(PIECE_ANIMATIONS)) {
      expect(config.actions.idle.frames).toBe(60);
    }
  });

  it('capture animations have 30 frames', () => {
    for (const config of Object.values(PIECE_ANIMATIONS)) {
      expect(config.actions.capture.frames).toBe(30);
    }
  });

  it('promote animations have 45 frames', () => {
    for (const config of Object.values(PIECE_ANIMATIONS)) {
      expect(config.actions.promote.frames).toBe(45);
    }
  });

  it('action names follow pattern {PieceName}_{action}', () => {
    for (const [pieceName, config] of Object.entries(PIECE_ANIMATIONS)) {
      for (const action of ACTION_NAMES) {
        expect(config.actions[action].name).toBe(`${pieceName}_${action}`);
      }
    }
  });
});
