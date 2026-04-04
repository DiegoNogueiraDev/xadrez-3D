import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useSettingsStore } from '../stores/useSettingsStore';
import { getPostFXForQuality } from '../lib/postfxConfig';

function FullEffects() {
  const quality = useSettingsStore((s) => s.quality);
  const config = getPostFXForQuality(quality);
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={config.bloom.threshold}
        intensity={config.bloom.enabled ? config.bloom.strength : 0}
        radius={config.bloom.radius}
      />
      <Vignette
        offset={config.vignette.offset}
        darkness={config.vignette.enabled ? config.vignette.darkness : 0}
      />
    </EffectComposer>
  );
}

export default function PostProcessingEffects() {
  const quality = useSettingsStore((s) => s.quality);
  if (quality === 'low') return null;
  return <FullEffects />;
}
