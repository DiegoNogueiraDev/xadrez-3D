import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockPlay,
  mockStop,
  mockVolume,
  mockRate,
  mockHowlerVolume,
  mockHowlerMute,
  mockHowlConstructor,
  MockHowl,
} = vi.hoisted(() => {
  const mockPlay = vi.fn().mockReturnValue(1);
  const mockStop = vi.fn();
  const mockVolume = vi.fn();
  const mockRate = vi.fn();
  const mockHowlerVolume = vi.fn();
  const mockHowlerMute = vi.fn();

  const mockHowlConstructor = vi.fn();

  class MockHowl {
    play = mockPlay;
    stop = mockStop;
    volume = mockVolume;
    rate = mockRate;
    constructor(opts: any) {
      mockHowlConstructor(opts);
    }
  }

  return {
    mockPlay,
    mockStop,
    mockVolume,
    mockRate,
    mockHowlerVolume,
    mockHowlerMute,
    mockHowlConstructor,
    MockHowl,
  };
});

vi.mock('howler', () => ({
  Howl: MockHowl,
  Howler: {
    volume: mockHowlerVolume,
    mute: mockHowlerMute,
  },
}));

import { soundManager, SoundManager, type SoundId } from './sounds';

describe('SoundManager', () => {
  beforeEach(() => {
    mockPlay.mockClear();
    mockStop.mockClear();
    mockVolume.mockClear();
    mockRate.mockClear();
    mockHowlConstructor.mockClear();
    mockHowlerVolume.mockClear();
    mockHowlerMute.mockClear();
    soundManager.unmute();
    mockHowlerMute.mockClear();
  });

  describe('singleton', () => {
    it('exports a singleton instance', () => {
      expect(soundManager).toBeInstanceOf(SoundManager);
    });

    it('returns the same reference on multiple accesses', () => {
      const ref1 = soundManager;
      const ref2 = soundManager;
      expect(ref1).toBe(ref2);
    });
  });

  describe('SoundId type', () => {
    it('accepts valid sound IDs', () => {
      const validIds: SoundId[] = [
        'move',
        'capture',
        'check',
        'castle',
        'promote',
        'ambient',
        'game_start',
        'game_over',
        'piece_pickup',
      ];
      expect(validIds).toHaveLength(9);
    });
  });

  describe('init()', () => {
    it('creates Howl instances for active sounds in manifest', () => {
      soundManager.init();
      // 8 active sounds (ambient removed from manifest)
      expect(mockHowlConstructor).toHaveBeenCalledTimes(8);
    });
  });

  describe('play()', () => {
    beforeEach(() => {
      soundManager.init();
      mockPlay.mockClear();
      mockVolume.mockClear();
      mockRate.mockClear();
    });

    it('calls Howl.play() for the given sound', () => {
      soundManager.play('move');
      expect(mockPlay).toHaveBeenCalledTimes(1);
    });

    it('applies volume option when provided', () => {
      soundManager.play('capture', { volume: 0.5 });
      expect(mockVolume).toHaveBeenCalledWith(0.5);
      expect(mockPlay).toHaveBeenCalled();
    });

    it('applies rate option when provided', () => {
      soundManager.play('check', { rate: 1.5 });
      expect(mockRate).toHaveBeenCalledWith(1.5);
      expect(mockPlay).toHaveBeenCalled();
    });

    it('does nothing for uninitialized sounds', () => {
      const freshManager = new SoundManager();
      freshManager.play('move');
      expect(mockPlay).not.toHaveBeenCalled();
    });
  });

  describe('setMasterVolume()', () => {
    it('sets Howler.volume to the given value', () => {
      soundManager.setMasterVolume(0.7);
      expect(mockHowlerVolume).toHaveBeenCalledWith(0.7);
    });

    it('clamps volume to 0 when negative', () => {
      soundManager.setMasterVolume(-0.5);
      expect(mockHowlerVolume).toHaveBeenCalledWith(0);
    });

    it('clamps volume to 1 when above 1', () => {
      soundManager.setMasterVolume(1.5);
      expect(mockHowlerVolume).toHaveBeenCalledWith(1);
    });
  });

  describe('mute() / unmute() / isMuted()', () => {
    it('mute() sets muted state and calls Howler.mute(true)', () => {
      soundManager.mute();
      expect(mockHowlerMute).toHaveBeenCalledWith(true);
      expect(soundManager.isMuted()).toBe(true);
    });

    it('unmute() clears muted state and calls Howler.mute(false)', () => {
      soundManager.mute();
      soundManager.unmute();
      expect(mockHowlerMute).toHaveBeenCalledWith(false);
      expect(soundManager.isMuted()).toBe(false);
    });

    it('isMuted() returns false by default', () => {
      expect(soundManager.isMuted()).toBe(false);
    });
  });

  describe('playAmbient() / stopAmbient()', () => {
    beforeEach(() => {
      soundManager.init();
      mockPlay.mockClear();
      mockStop.mockClear();
    });

    it('playAmbient() does nothing when ambient not in manifest', () => {
      soundManager.playAmbient();
      // ambient is not in manifest, so play should not be called
      expect(mockPlay).not.toHaveBeenCalled();
    });

    it('stopAmbient() does nothing when ambient not loaded', () => {
      soundManager.stopAmbient();
      expect(mockStop).not.toHaveBeenCalled();
    });
  });
});
