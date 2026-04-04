import * as THREE from 'three';
import { PIECE_SCALE, PIECE_HEIGHT_OFFSET } from '../utils/constants';

export function createKingGeometry(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();

  // Base cylinder
  const baseGeo = new THREE.CylinderGeometry(0.42, 0.46, 0.15, 32);
  const base = new THREE.Mesh(baseGeo, material);
  base.position.y = 0.075;
  base.castShadow = true;
  group.add(base);

  // Body via LatheGeometry
  const bodyPoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.36, 0),
    new THREE.Vector2(0.34, 0.05),
    new THREE.Vector2(0.26, 0.2),
    new THREE.Vector2(0.19, 0.5),
    new THREE.Vector2(0.15, 0.75),
    new THREE.Vector2(0.13, 0.95),
    new THREE.Vector2(0.15, 1.0),   // collar
    new THREE.Vector2(0.18, 1.05),
    new THREE.Vector2(0.2, 1.1),
    new THREE.Vector2(0.18, 1.15),
    new THREE.Vector2(0.14, 1.2),
    new THREE.Vector2(0, 1.2),
  ];
  const bodyGeo = new THREE.LatheGeometry(bodyPoints, 32);
  const body = new THREE.Mesh(bodyGeo, material);
  body.position.y = 0.15;
  body.castShadow = true;
  group.add(body);

  // Crown band (torus)
  const torusGeo = new THREE.TorusGeometry(0.16, 0.03, 12, 32);
  const torus = new THREE.Mesh(torusGeo, material);
  torus.position.y = 1.35;
  torus.rotation.x = Math.PI / 2;
  torus.castShadow = true;
  group.add(torus);

  // Cross on top (two thin boxes)
  const crossVertGeo = new THREE.BoxGeometry(0.06, 0.3, 0.06);
  const crossVert = new THREE.Mesh(crossVertGeo, material);
  crossVert.position.y = 1.5;
  crossVert.castShadow = true;
  group.add(crossVert);

  const crossHorizGeo = new THREE.BoxGeometry(0.22, 0.06, 0.06);
  const crossHoriz = new THREE.Mesh(crossHorizGeo, material);
  crossHoriz.position.y = 1.55;
  crossHoriz.castShadow = true;
  group.add(crossHoriz);

  group.scale.setScalar(PIECE_SCALE);
  group.position.y = PIECE_HEIGHT_OFFSET;

  return group;
}
