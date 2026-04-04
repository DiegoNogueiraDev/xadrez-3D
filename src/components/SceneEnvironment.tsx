import { Environment } from '@react-three/drei';
import { ENVIRONMENT_CONFIG } from '../lib/environment';

export default function SceneEnvironment() {
  return (
    <Environment
      files={ENVIRONMENT_CONFIG.path}
      background={true}
      backgroundBlurriness={0.6}
      environmentIntensity={0.4}
    />
  );
}
