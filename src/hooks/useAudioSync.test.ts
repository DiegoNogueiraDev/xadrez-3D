import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSettingsStore } from '../stores/useSettingsStore';

// Mock SoundManager
const mockSetMasterVolume = vi.fn();
const mockMute = vi.fn();
const mockUnmute = vi.fn();

vi.mock('../lib/sounds', () => ({
  soundManager: {
    setMasterVolume: (...args: unknown[]) => mockSetMasterVolume(...args),
    mute: () => mockMute(),
    unmute: () => mockUnmute(),
  },
}));

import { useAudioSync } from './useAudioSync';

describe('useAudioSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.setState({
      volume: 0.8,
      quality: 'high',
      shadowsEnabled: true,
      particlesEnabled: true,
      muted: false,
    });
  });

  it('calls setMasterVolume with initial volume on mount', () => {
    renderHook(() => useAudioSync());
    expect(mockSetMasterVolume).toHaveBeenCalledWith(0.8);
  });

  it('calls setMasterVolume when volume changes', () => {
    renderHook(() => useAudioSync());
    mockSetMasterVolume.mockClear();

    act(() => {
      useSettingsStore.getState().setVolume(0.5);
    });

    expect(mockSetMasterVolume).toHaveBeenCalledWith(0.5);
  });

  it('calls mute when muted becomes true', () => {
    renderHook(() => useAudioSync());

    act(() => {
      useSettingsStore.getState().toggleMute();
    });

    expect(mockMute).toHaveBeenCalled();
  });

  it('calls unmute when muted becomes false', () => {
    useSettingsStore.setState({ muted: true });
    renderHook(() => useAudioSync());
    mockUnmute.mockClear();

    act(() => {
      useSettingsStore.getState().toggleMute();
    });

    expect(mockUnmute).toHaveBeenCalled();
  });
});
