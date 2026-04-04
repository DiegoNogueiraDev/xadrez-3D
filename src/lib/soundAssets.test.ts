import { describe, it, expect } from 'vitest';
import {
  SOUND_MANIFEST,
  getSoundPath,
  getSoundPaths,
  type SoundAsset,
} from './soundAssets';
import type { SoundId } from './sounds';

const ALL_SOUND_IDS: SoundId[] = [
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

describe('SOUND_MANIFEST', () => {
  it('exports exactly 9 entries matching all SoundId values', () => {
    expect(Object.keys(SOUND_MANIFEST)).toHaveLength(9);
    for (const id of ALL_SOUND_IDS) {
      expect(SOUND_MANIFEST).toHaveProperty(id);
    }
  });

  it('each entry has path, label, and format fields', () => {
    for (const asset of Object.values(SOUND_MANIFEST)) {
      expect(typeof asset.path).toBe('string');
      expect(typeof asset.label).toBe('string');
      expect(['mp3', 'ogg', 'wav']).toContain(asset.format);
    }
  });

  it('all paths follow pattern /sounds/{id}.mp3', () => {
    for (const [id, asset] of Object.entries(SOUND_MANIFEST)) {
      expect(asset.path).toBe(`/sounds/${id}.mp3`);
    }
  });

  it('all labels are non-empty strings', () => {
    for (const asset of Object.values(SOUND_MANIFEST)) {
      expect(asset.label.length).toBeGreaterThan(0);
    }
  });
});

describe('getSoundPath', () => {
  it('returns the path for a given SoundId', () => {
    expect(getSoundPath('move')).toBe('/sounds/move.mp3');
    expect(getSoundPath('capture')).toBe('/sounds/capture.mp3');
    expect(getSoundPath('ambient')).toBe('/sounds/ambient.mp3');
  });

  it('returns correct path for all 9 SoundIds', () => {
    for (const id of ALL_SOUND_IDS) {
      const path = getSoundPath(id);
      expect(path).toBe(`/sounds/${id}.mp3`);
    }
  });
});

describe('getSoundPaths', () => {
  it('returns an array of 9 paths', () => {
    const paths = getSoundPaths();
    expect(paths).toHaveLength(9);
  });

  it('all paths are strings starting with /sounds/', () => {
    for (const path of getSoundPaths()) {
      expect(path).toMatch(/^\/sounds\//);
    }
  });
});
