import { useEffect } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { soundManager } from '../lib/sounds';

export function useAudioSync(): void {
  const volume = useSettingsStore((s) => s.volume);
  const muted = useSettingsStore((s) => s.muted);

  useEffect(() => {
    soundManager.setMasterVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (muted) {
      soundManager.mute();
    } else {
      soundManager.unmute();
    }
  }, [muted]);
}
