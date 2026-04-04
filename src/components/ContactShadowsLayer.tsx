import { ContactShadows } from '@react-three/drei';
import { useSettingsStore } from '../stores/useSettingsStore';
import { getContactShadowsForQuality } from '../lib/contactShadowsConfig';

export default function ContactShadowsLayer() {
  const quality = useSettingsStore((s) => s.quality);
  const config = getContactShadowsForQuality(quality);

  if (!config.enabled) return null;

  return (
    <ContactShadows
      position={config.position}
      opacity={config.opacity}
      blur={config.blur}
      width={config.width}
      height={config.height}
      far={config.far}
      resolution={config.resolution}
      frames={config.frames}
    />
  );
}
