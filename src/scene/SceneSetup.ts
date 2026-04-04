import * as THREE from 'three';
import { COLORS, CAMERA } from '../utils/constants';

export class SceneSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(COLORS.background);

    this.camera = new THREE.PerspectiveCamera(
      CAMERA.fov,
      window.innerWidth / window.innerHeight,
      CAMERA.near,
      CAMERA.far
    );
    this.camera.position.set(CAMERA.whitePosition.x, CAMERA.whitePosition.y, CAMERA.whitePosition.z);
    this.camera.lookAt(CAMERA.lookAt.x, CAMERA.lookAt.y, CAMERA.lookAt.z);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.setupLights();
    this.setupResize();
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -8;
    mainLight.shadow.camera.right = 8;
    mainLight.shadow.camera.top = 8;
    mainLight.shadow.camera.bottom = -8;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffaa44, 0.2);
    rimLight.position.set(0, 3, -8);
    this.scene.add(rimLight);
  }

  private setupResize(): void {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
