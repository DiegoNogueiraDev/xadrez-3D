import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createParticles,
  updateParticles,
  type ParticleConfig,
  type ParticleState,
} from '../lib/particleSystem';

interface ParticleSystemProps {
  origin: [number, number, number];
  config: ParticleConfig;
  active: boolean;
}

export default function ParticleSystem({
  origin,
  config,
  active,
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const stateRef = useRef<ParticleState | null>(null);

  const color = useMemo(() => new THREE.Color(config.color), [config.color]);

  if (active && !stateRef.current) {
    stateRef.current = createParticles(config);
  }

  useFrame((_, delta) => {
    if (!active || !stateRef.current || !pointsRef.current) return;

    updateParticles(stateRef.current, delta, config);

    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    posAttr.array.set(stateRef.current.positions);
    posAttr.needsUpdate = true;
  });

  if (!active) {
    stateRef.current = null;
    return null;
  }

  return (
    <points ref={pointsRef} position={origin}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[stateRef.current?.positions ?? new Float32Array(0), 3]}
          count={config.count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={config.size}
        transparent
        opacity={0.8}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
