import * as THREE from 'three';
import { BOARD_SIZE, SQUARE_SIZE, COLORS, BOARD_OFFSET } from '../utils/constants';

export class BoardManager {
  private scene: THREE.Scene;
  squareMeshes: Map<string, THREE.Mesh> = new Map();
  boardGroup: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.boardGroup = new THREE.Group();
    this.scene.add(this.boardGroup);
  }

  create(): void {
    this.createSquares();
    this.createBorder();
    this.createLabels();
  }

  private createSquares(): void {
    const geometry = new THREE.BoxGeometry(SQUARE_SIZE, 0.1, SQUARE_SIZE);

    for (let file = 0; file < BOARD_SIZE; file++) {
      for (let rank = 0; rank < BOARD_SIZE; rank++) {
        const isLight = (file + rank) % 2 === 0;
        const material = new THREE.MeshStandardMaterial({
          color: isLight ? COLORS.lightSquare : COLORS.darkSquare,
          roughness: 0.8,
          metalness: 0.1,
        });

        const square = new THREE.Mesh(geometry, material);
        const x = file * SQUARE_SIZE - BOARD_OFFSET;
        const z = (7 - rank) * SQUARE_SIZE - BOARD_OFFSET;
        square.position.set(x, -0.05, z);
        square.receiveShadow = true;

        const squareKey = String.fromCharCode('a'.charCodeAt(0) + file) + (rank + 1);
        square.userData = { type: 'square', square: squareKey, file, rank };
        this.squareMeshes.set(squareKey, square);
        this.boardGroup.add(square);
      }
    }
  }

  private createBorder(): void {
    const borderThickness = 0.3;
    const boardWidth = BOARD_SIZE * SQUARE_SIZE;
    const totalWidth = boardWidth + borderThickness * 2;

    const borderMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.boardBorder,
      roughness: 0.6,
      metalness: 0.2,
    });

    // Base
    const baseGeom = new THREE.BoxGeometry(totalWidth, 0.15, totalWidth);
    const base = new THREE.Mesh(baseGeom, borderMaterial);
    base.position.set(0, -0.175, 0);
    base.receiveShadow = true;
    this.boardGroup.add(base);

    // Side borders
    const sides = [
      { w: totalWidth, d: borderThickness, x: 0, z: -(boardWidth / 2 + borderThickness / 2) },
      { w: totalWidth, d: borderThickness, x: 0, z: boardWidth / 2 + borderThickness / 2 },
      { w: borderThickness, d: boardWidth, x: -(boardWidth / 2 + borderThickness / 2), z: 0 },
      { w: borderThickness, d: boardWidth, x: boardWidth / 2 + borderThickness / 2, z: 0 },
    ];

    sides.forEach(({ w, d, x, z }) => {
      const geom = new THREE.BoxGeometry(w, 0.2, d);
      const mesh = new THREE.Mesh(geom, borderMaterial);
      mesh.position.set(x, -0.05, z);
      mesh.receiveShadow = true;
      this.boardGroup.add(mesh);
    });
  }

  private createLabels(): void {
    const loader = new THREE.TextureLoader();
    const files = 'abcdefgh';
    const labelOffset = BOARD_OFFSET + 0.65;

    for (let i = 0; i < 8; i++) {
      // File labels (a-h)
      this.addTextLabel(
        files[i],
        i * SQUARE_SIZE - BOARD_OFFSET,
        -0.04,
        labelOffset
      );
      this.addTextLabel(
        files[i],
        i * SQUARE_SIZE - BOARD_OFFSET,
        -0.04,
        -labelOffset
      );

      // Rank labels (1-8)
      this.addTextLabel(
        String(i + 1),
        -labelOffset,
        -0.04,
        (7 - i) * SQUARE_SIZE - BOARD_OFFSET
      );
      this.addTextLabel(
        String(i + 1),
        labelOffset,
        -0.04,
        (7 - i) * SQUARE_SIZE - BOARD_OFFSET
      );
    }
  }

  private addTextLabel(text: string, x: number, y: number, z: number): void {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#b58863';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(0.3, 0.3);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y, z);
    this.boardGroup.add(mesh);
  }

  getSquareMesh(square: string): THREE.Mesh | undefined {
    return this.squareMeshes.get(square);
  }
}
