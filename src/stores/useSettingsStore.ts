import { create } from 'zustand';

export type QualityPreset = 'low' | 'medium' | 'high';

interface SettingsState {
  volume: number;
  quality: QualityPreset;
  shadowsEnabled: boolean;
  particlesEnabled: boolean;
  muted: boolean;

  setVolume: (v: number) => void;
  setQuality: (q: QualityPreset) => void;
  toggleShadows: () => void;
  toggleParticles: () => void;
  toggleMute: () => void;
}

type SettingsData = Pick<SettingsState, 'volume' | 'quality' | 'shadowsEnabled' | 'particlesEnabled' | 'muted'>;

function loadFromStorage(): Partial<SettingsData> {
  try {
    const saved = localStorage.getItem('chess3d-settings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

function saveToStorage(state: Partial<SettingsState>) {
  try {
    localStorage.setItem(
      'chess3d-settings',
      JSON.stringify({
        volume: state.volume,
        quality: state.quality,
        shadowsEnabled: state.shadowsEnabled,
        particlesEnabled: state.particlesEnabled,
        muted: state.muted,
      })
    );
  } catch {}
}

const defaults = {
  volume: 0.8,
  quality: 'high' as QualityPreset,
  shadowsEnabled: true,
  particlesEnabled: true,
  muted: false,
};

const stored = loadFromStorage();

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaults,
  ...stored,

  setVolume: (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    set({ volume: clamped });
    saveToStorage({ ...get(), volume: clamped });
  },

  setQuality: (q: QualityPreset) => {
    set({ quality: q });
    saveToStorage({ ...get(), quality: q });
  },

  toggleShadows: () => {
    const next = !get().shadowsEnabled;
    set({ shadowsEnabled: next });
    saveToStorage({ ...get(), shadowsEnabled: next });
  },

  toggleParticles: () => {
    const next = !get().particlesEnabled;
    set({ particlesEnabled: next });
    saveToStorage({ ...get(), particlesEnabled: next });
  },

  toggleMute: () => {
    const next = !get().muted;
    set({ muted: next });
    saveToStorage({ ...get(), muted: next });
  },
}));
