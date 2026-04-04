import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSettingsStore } from './useSettingsStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('useSettingsStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset store to defaults
    useSettingsStore.setState({
      volume: 0.8,
      quality: 'high',
      shadowsEnabled: true,
      particlesEnabled: true,
      muted: false,
    });
  });

  describe('initial state', () => {
    it('has default volume of 0.8', () => {
      expect(useSettingsStore.getState().volume).toBe(0.8);
    });

    it('has default quality of high', () => {
      expect(useSettingsStore.getState().quality).toBe('high');
    });

    it('has shadows enabled by default', () => {
      expect(useSettingsStore.getState().shadowsEnabled).toBe(true);
    });

    it('has particles enabled by default', () => {
      expect(useSettingsStore.getState().particlesEnabled).toBe(true);
    });
  });

  describe('actions', () => {
    it('setVolume updates volume and clamps to 0-1', () => {
      useSettingsStore.getState().setVolume(0.5);
      expect(useSettingsStore.getState().volume).toBe(0.5);

      useSettingsStore.getState().setVolume(-0.1);
      expect(useSettingsStore.getState().volume).toBe(0);

      useSettingsStore.getState().setVolume(1.5);
      expect(useSettingsStore.getState().volume).toBe(1);
    });

    it('setQuality updates quality preset', () => {
      useSettingsStore.getState().setQuality('low');
      expect(useSettingsStore.getState().quality).toBe('low');

      useSettingsStore.getState().setQuality('medium');
      expect(useSettingsStore.getState().quality).toBe('medium');
    });

    it('toggleShadows flips shadowsEnabled', () => {
      useSettingsStore.getState().toggleShadows();
      expect(useSettingsStore.getState().shadowsEnabled).toBe(false);

      useSettingsStore.getState().toggleShadows();
      expect(useSettingsStore.getState().shadowsEnabled).toBe(true);
    });

    it('toggleParticles flips particlesEnabled', () => {
      useSettingsStore.getState().toggleParticles();
      expect(useSettingsStore.getState().particlesEnabled).toBe(false);

      useSettingsStore.getState().toggleParticles();
      expect(useSettingsStore.getState().particlesEnabled).toBe(true);
    });

    it('toggleMute flips muted state', () => {
      expect(useSettingsStore.getState().muted).toBe(false);

      useSettingsStore.getState().toggleMute();
      expect(useSettingsStore.getState().muted).toBe(true);

      useSettingsStore.getState().toggleMute();
      expect(useSettingsStore.getState().muted).toBe(false);
    });

    it('toggleMute persists muted to localStorage', () => {
      useSettingsStore.getState().toggleMute();
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const lastCall = localStorageMock.setItem.mock.calls.at(-1)!;
      const saved = JSON.parse(lastCall[1]);
      expect(saved.muted).toBe(true);
    });
  });

  describe('muted initial state', () => {
    it('has muted false by default', () => {
      expect(useSettingsStore.getState().muted).toBe(false);
    });
  });
});
