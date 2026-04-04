import * as THREE from 'three';
import { PIECE_SCALE, PIECE_HEIGHT_OFFSET } from '../utils/constants';

export function createQueenGeometry(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();

  // Base cylinder
  const baseGeo = new THREE.CylinderGeometry(0.40, 0.44, 0.15, 32);
  const base = new THREE.Mesh(baseGeo, material);
  base.position.y = 0.075;
  base.castShadow = true;
  group.add(base);

  // Elegant body via LatheGeometry
  const bodyPoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.34, 0),
    new THREE.Vector2(0.32, 0.05),
    new THREE.Vector2(0.24, 0.2),
    new THREE.Vector2(0.17, 0.5),
    new THREE.Vector2(0.14, 0.75),
    new THREE.Vector2(0.12, 0.9),
    new THREE.Vector2(0.13, 0.95),  // collar
    new THREE.Vector2(0.16, 1.0),
    new THREE.Vector2(0.18, 1.05),
    new THREE.Vector2(0.16, 1.1),
    new THREE.Vector2(0.12, 1.15),
    new THREE.Vector2(0, 1.15),
  ];
  const bodyGeo = new THREE.LatheGeometry(bodyPoints, 32);
  const body = new THREE.Mesh(bodyGeo, material);
  body.position.y = 0.15;
  body.castShadow = true;
  group.add(body);

  // Crown points (small cones arranged in a circle)
  const crownPointCount = 8;
  const crownRadius = 0.14;
  const crownBaseY = 1.3;
  const coneGeo = new THREE.ConeGeometry(0.03, 0.15, 8);
  for (let i = 0; i < crownPointCount; i++) {
    const angle = (i / crownPointCount) * Math.PI * 2;
    const cone = new THREE.Mesh(coneGeo, material);
    cone.position.set(
      Math.cos(angle) * crownRadius,
      crownBaseY + 0.075,
      Math.sin(angle) * crownRadius
    );
    cone.castShadow = true;
    group.add(cone);
  }

  // Small sphere on top of crown
  const topSphereGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const topSphere = new THREE.Mesh(topSphereGeo, material);
  topSphere.position.y = crownBaseY + 0.2;
  topSphere.castShadow = true;
  group.add(topSphere);

  // Torus ring at crown base
  const torusGeo = new THREE.TorusGeometry(crownRadius, 0.025, 12, 32);
  const torus = new THREE.Mesh(torusGeo, material);
  torus.position.y = crownBaseY;
  torus.rotation.x = Math.PI / 2;
  torus.castShadow = true;
  group.add(torus);

  group.scale.setScalar(PIECE_SCALE);
  group.position.y = PIECE_HEIGHT_OFFSET;

  return group;
}
