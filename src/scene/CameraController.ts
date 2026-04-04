import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CAMERA } from '../utils/constants';

export class CameraController {
  controls: OrbitControls;
  private camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 18;
    this.controls.maxPolarAngle = Math.PI / 2.2;
    this.controls.minPolarAngle = Math.PI / 8;
    this.controls.target.set(CAMERA.lookAt.x, CAMERA.lookAt.y, CAMERA.lookAt.z);
    this.controls.update();
  }

  setPlayerPerspective(color: 'w' | 'b'): void {
    const pos = color === 'w' ? CAMERA.whitePosition : CAMERA.blackPosition;
    this.camera.position.set(pos.x, pos.y, pos.z);
    this.controls.target.set(CAMERA.lookAt.x, CAMERA.lookAt.y, CAMERA.lookAt.z);
    this.controls.update();
  }

  update(): void {
    this.controls.update();
  }
}
