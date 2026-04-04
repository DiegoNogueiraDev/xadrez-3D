import * as THREE from 'three';
import { PIECE_SCALE, PIECE_HEIGHT_OFFSET } from '../utils/constants';

export function createBishopGeometry(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();

  // Base cylinder
  const baseGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.15, 32);
  const base = new THREE.Mesh(baseGeo, material);
  base.position.y = 0.075;
  base.castShadow = true;
  group.add(base);

  // Body via LatheGeometry (elegant tapered profile)
  const bodyPoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.32, 0),
    new THREE.Vector2(0.30, 0.05),
    new THREE.Vector2(0.22, 0.2),
    new THREE.Vector2(0.16, 0.45),
    new THREE.Vector2(0.13, 0.65),
    new THREE.Vector2(0.15, 0.7),  // slight bulge (collar)
    new THREE.Vector2(0.13, 0.75),
    new THREE.Vector2(0.10, 0.85),
    new THREE.Vector2(0.06, 1.0),
    new THREE.Vector2(0.02, 1.1),
    new THREE.Vector2(0, 1.12),
  ];
  const bodyGeo = new THREE.LatheGeometry(bodyPoints, 32);
  const body = new THREE.Mesh(bodyGeo, material);
  body.position.y = 0.15;
  body.castShadow = true;
  group.add(body);

  // Pointed top sphere
  const tipGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const tip = new THREE.Mesh(tipGeo, material);
  tip.position.y = 0.15 + 1.12 + 0.06;
  tip.castShadow = true;
  group.add(tip);

  // Diagonal slit (a thin box rotated at an angle, using a slightly different approach)
  // We create a thin box and position/rotate it to cut across the bishop's miter
  const slitGeo = new THREE.BoxGeometry(0.22, 0.02, 0.06);
  const slitMaterial = material.clone();
  const slit = new THREE.Mesh(slitGeo, slitMaterial);
  slit.position.set(0, 1.05, 0.08);
  slit.rotation.z = Math.PI / 4; // 45 degree diagonal
  slit.castShadow = true;
  group.add(slit);

  group.scale.setScalar(PIECE_SCALE);
  group.position.y = PIECE_HEIGHT_OFFSET;

  return group;
}
