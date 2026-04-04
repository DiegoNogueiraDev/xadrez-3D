import * as THREE from 'three';
import { PIECE_SCALE, PIECE_HEIGHT_OFFSET } from '../utils/constants';

export function createPawnGeometry(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();

  // Base cylinder
  const baseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.15, 32);
  const base = new THREE.Mesh(baseGeo, material);
  base.position.y = 0.075;
  base.castShadow = true;
  group.add(base);

  // Body via LatheGeometry (tapered profile)
  const bodyPoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.3, 0),
    new THREE.Vector2(0.28, 0.05),
    new THREE.Vector2(0.18, 0.25),
    new THREE.Vector2(0.12, 0.45),
    new THREE.Vector2(0.1, 0.5),
    new THREE.Vector2(0.08, 0.52),
    new THREE.Vector2(0, 0.52),
  ];
  const bodyGeo = new THREE.LatheGeometry(bodyPoints, 32);
  const body = new THREE.Mesh(bodyGeo, material);
  body.position.y = 0.15;
  body.castShadow = true;
  group.add(body);

  // Sphere on top
  const sphereGeo = new THREE.SphereGeometry(0.13, 16, 16);
  const sphere = new THREE.Mesh(sphereGeo, material);
  sphere.position.y = 0.15 + 0.52 + 0.1;
  sphere.castShadow = true;
  group.add(sphere);

  group.scale.setScalar(PIECE_SCALE);
  group.position.y = PIECE_HEIGHT_OFFSET;

  return group;
}
