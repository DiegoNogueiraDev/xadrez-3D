import * as THREE from 'three';
import { PIECE_SCALE, PIECE_HEIGHT_OFFSET } from '../utils/constants';

export function createRookGeometry(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();

  // Base cylinder
  const baseGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.15, 32);
  const base = new THREE.Mesh(baseGeo, material);
  base.position.y = 0.075;
  base.castShadow = true;
  group.add(base);

  // Lower rim
  const rimGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.08, 32);
  const rim = new THREE.Mesh(rimGeo, material);
  rim.position.y = 0.19;
  rim.castShadow = true;
  group.add(rim);

  // Main body cylinder (slightly tapered)
  const bodyGeo = new THREE.CylinderGeometry(0.22, 0.3, 0.7, 32);
  const body = new THREE.Mesh(bodyGeo, material);
  body.position.y = 0.58;
  body.castShadow = true;
  group.add(body);

  // Upper platform
  const platformGeo = new THREE.CylinderGeometry(0.32, 0.25, 0.1, 32);
  const platform = new THREE.Mesh(platformGeo, material);
  platform.position.y = 0.98;
  platform.castShadow = true;
  group.add(platform);

  // Battlements (merlons) on top
  const merlonGeo = new THREE.BoxGeometry(0.12, 0.15, 0.12);
  const merlonCount = 5;
  const merlonRadius = 0.22;
  for (let i = 0; i < merlonCount; i++) {
    const angle = (i / merlonCount) * Math.PI * 2;
    const merlon = new THREE.Mesh(merlonGeo, material);
    merlon.position.set(
      Math.cos(angle) * merlonRadius,
      1.105,
      Math.sin(angle) * merlonRadius
    );
    merlon.castShadow = true;
    group.add(merlon);
  }

  group.scale.setScalar(PIECE_SCALE);
  group.position.y = PIECE_HEIGHT_OFFSET;

  return group;
}
