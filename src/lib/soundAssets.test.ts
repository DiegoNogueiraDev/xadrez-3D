import { describe, it, expect } from 'vitest';
import {
  SOUND_MANIFEST,
  getSoundPath,
  getSoundPaths,
} from './soundAssets';

const ACTIVE_SOUND_IDS = [
  'move',
  'capture',
  'check',
  'castle',
  'promote',
  'game_start',
  'game_over',
  'piece_pickup',
];

describe('SOUND_MANIFEST', () => {
  it('exports 8 active sound entries', () => {
    expect(Object.keys(SOUND_MANIFEST)).toHaveLength(8);
    for (const id of ACTIVE_SOUND_IDS) {
      expect(SOUND_MANIFEST).toHaveProperty(id);
    }
  });

  it('each entry has path, label, and format fields', () => {
    for (const asset of Object.values(SOUND_MANIFEST)) {
      if (!asset) continue;
      expect(typeof asset.path).toBe('string');
      expect(typeof asset.label).toBe('string');
      expect(['mp3', 'ogg', 'wav']).toContain(asset.format);
    }
  });

  it('all paths follow pattern /sounds/{id}.mp3', () => {
    for (const [id, asset] of Object.entries(SOUND_MANIFEST)) {
      if (!asset) continue;
      expect(asset.path).toBe(`/sounds/${id}.mp3`);
    }
  });
});

describe('getSoundPath', () => {
  it('returns the path for active sounds', () => {
    expect(getSoundPath('move')).toBe('/sounds/move.mp3');
    expect(getSoundPath('capture')).toBe('/sounds/capture.mp3');
  });

  it('returns empty string for missing sounds', () => {
    expect(getSoundPath('ambient')).toBe('');
  });
});

describe('getSoundPaths', () => {
  it('returns an array of 8 paths', () => {
    const paths = getSoundPaths();
    expect(paths).toHaveLength(8);
  });

  it('all paths start with /sounds/', () => {
    for (const path of getSoundPaths()) {
      expect(path).toMatch(/^\/sounds\//);
    }
  });
});
