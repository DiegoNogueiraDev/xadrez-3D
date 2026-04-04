import { useSettingsStore, type QualityPreset } from '../stores/useSettingsStore';

const QUALITY_OPTIONS: { value: QualityPreset; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function SettingsPanel() {
  const volume = useSettingsStore((s) => s.volume);
  const quality = useSettingsStore((s) => s.quality);
  const shadowsEnabled = useSettingsStore((s) => s.shadowsEnabled);
  const particlesEnabled = useSettingsStore((s) => s.particlesEnabled);
  const muted = useSettingsStore((s) => s.muted);
  const setVolume = useSettingsStore((s) => s.setVolume);
  const setQuality = useSettingsStore((s) => s.setQuality);
  const toggleShadows = useSettingsStore((s) => s.toggleShadows);
  const toggleParticles = useSettingsStore((s) => s.toggleParticles);
  const toggleMute = useSettingsStore((s) => s.toggleMute);

  return (
    <div data-testid="settings-panel" className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 space-y-4 w-64">
      <h3 className="text-lg font-semibold text-white">Configurações</h3>

      {/* Mute */}
      <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
        <input
          type="checkbox"
          checked={muted}
          onChange={toggleMute}
          data-testid="mute-toggle"
          className="rounded"
        />
        Mudo
      </label>

      {/* Volume */}
      <div className="space-y-1">
        <label className="text-sm text-neutral-300">Volume: {Math.round(volume * 100)}%</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          data-testid="volume-slider"
          className="w-full"
        />
      </div>

      {/* Quality */}
      <div className="space-y-1">
        <label className="text-sm text-neutral-300">Qualidade</label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value as QualityPreset)}
          data-testid="quality-selector"
          className="w-full py-2 px-3 bg-neutral-900 border border-neutral-600 rounded text-white"
        >
          {QUALITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Shadows */}
      <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
        <input
          type="checkbox"
          checked={shadowsEnabled}
          onChange={toggleShadows}
          data-testid="shadows-toggle"
          className="rounded"
        />
        Sombras
      </label>

      {/* Particles */}
      <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
        <input
          type="checkbox"
          checked={particlesEnabled}
          onChange={toggleParticles}
          data-testid="particles-toggle"
          className="rounded"
        />
        Partículas
      </label>
    </div>
  );
}
