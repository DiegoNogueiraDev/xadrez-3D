import { useSettingsStore } from '../stores/useSettingsStore';
import { getLightingForQuality } from '../lib/lightingConfig';

export default function SceneLighting() {
  const quality = useSettingsStore((s) => s.quality);
  const lighting = getLightingForQuality(quality);

  return (
    <>
      <ambientLight intensity={lighting.ambient.intensity} color={lighting.ambient.color} />
      <directionalLight
        position={lighting.key.position}
        intensity={lighting.key.intensity}
        castShadow={lighting.key.castShadow}
        shadow-mapSize-width={lighting.key.shadowMapSize}
        shadow-mapSize-height={lighting.key.shadowMapSize}
        color={lighting.key.color}
      />
      <directionalLight
        position={lighting.fill.position}
        intensity={lighting.fill.intensity}
        color={lighting.fill.color}
      />
      <directionalLight
        position={lighting.rim.position}
        intensity={lighting.rim.intensity}
        color={lighting.rim.color}
      />
    </>
  );
}
