import * as THREE from 'three';
import { PIECE_SCALE, PIECE_HEIGHT_OFFSET } from '../utils/constants';

export function createKnightGeometry(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();

  // Base cylinder
  const baseGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.15, 32);
  const base = new THREE.Mesh(baseGeo, material);
  base.position.y = 0.075;
  base.castShadow = true;
  group.add(base);

  // Lower rim
  const rimGeo = new THREE.CylinderGeometry(0.34, 0.38, 0.08, 32);
  const rim = new THREE.Mesh(rimGeo, material);
  rim.position.y = 0.19;
  rim.castShadow = true;
  group.add(rim);

  // Neck - LatheGeometry for the curved neck/head shape
  const neckPoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.28, 0),
    new THREE.Vector2(0.25, 0.05),
    new THREE.Vector2(0.18, 0.2),
    new THREE.Vector2(0.15, 0.4),
    new THREE.Vector2(0.14, 0.55),
    new THREE.Vector2(0.12, 0.65),
    new THREE.Vector2(0.08, 0.7),
    new THREE.Vector2(0, 0.7),
  ];
  const neckGeo = new THREE.LatheGeometry(neckPoints, 32);
  const neck = new THREE.Mesh(neckGeo, material);
  neck.position.y = 0.23;
  neck.castShadow = true;
  group.add(neck);

  // Horse head - tilted elongated shape using a box + sphere combo
  const headGroup = new THREE.Group();

  // Main head block
  const headGeo = new THREE.BoxGeometry(0.22, 0.5, 0.18);
  const head = new THREE.Mesh(headGeo, material);
  head.position.set(0, 0.25, 0);
  head.castShadow = true;
  headGroup.add(head);

  // Snout (elongated box, extending forward)
  const snoutGeo = new THREE.BoxGeometry(0.18, 0.18, 0.28);
  const snout = new THREE.Mesh(snoutGeo, material);
  snout.position.set(0, 0.05, 0.18);
  snout.castShadow = true;
  headGroup.add(snout);

  // Ear shapes (two small cones)
  const earGeo = new THREE.ConeGeometry(0.05, 0.12, 8);
  const earL = new THREE.Mesh(earGeo, material);
  earL.position.set(-0.07, 0.52, 0.0);
  earL.castShadow = true;
  headGroup.add(earL);

  const earR = new THREE.Mesh(earGeo, material);
  earR.position.set(0.07, 0.52, 0.0);
  earR.castShadow = true;
  headGroup.add(earR);

  // Round top of head
  const topGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const top = new THREE.Mesh(topGeo, material);
  top.position.set(0, 0.45, 0.02);
  top.castShadow = true;
  headGroup.add(top);

  // Position and tilt the head forward
  headGroup.position.set(0, 0.85, 0.05);
  headGroup.rotation.x = -0.3;
  group.add(headGroup);

  group.scale.setScalar(PIECE_SCALE);
  group.position.y = PIECE_HEIGHT_OFFSET;

  return group;
}
