import { create } from 'zustand';

export type QualityPreset = 'low' | 'medium' | 'high';

interface SettingsState {
  volume: number;
  quality: QualityPreset;
  shadowsEnabled: boolean;
  particlesEnabled: boolean;

  setVolume: (v: number) => void;
  setQuality: (q: QualityPreset) => void;
  toggleShadows: () => void;
  toggleParticles: () => void;
}

function loadFromStorage(): Partial<SettingsState> {
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
      })
    );
  } catch {}
}

const defaults = {
  volume: 0.8,
  quality: 'high' as QualityPreset,
  shadowsEnabled: true,
  particlesEnabled: true,
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
}));
