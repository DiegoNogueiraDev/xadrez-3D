import * as THREE from 'three';
import { COLORS, SQUARE_SIZE } from '../utils/constants';
import { algebraicToWorld } from '../utils/helpers';

export class HighlightManager {
  private scene: THREE.Scene;
  private validMoveIndicators: THREE.Mesh[] = [];
  private selectedHighlight: THREE.Mesh | null = null;
  private lastMoveHighlights: THREE.Mesh[] = [];
  private checkHighlight: THREE.Mesh | null = null;
  private clock: THREE.Clock;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.clock = new THREE.Clock();
  }

  showValidMoves(squares: string[]): void {
    this.clearValidMoves();

    for (const square of squares) {
      const pos = algebraicToWorld(square);
      const geometry = new THREE.CircleGeometry(SQUARE_SIZE * 0.18, 24);
      const material = new THREE.MeshBasicMaterial({
        color: COLORS.validMoveIndicator,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      });

      const indicator = new THREE.Mesh(geometry, material);
      indicator.rotation.x = -Math.PI / 2;
      indicator.position.set(pos.x, 0.02, pos.z);
      indicator.userData = { type: 'validMove', square };

      this.scene.add(indicator);
      this.validMoveIndicators.push(indicator);
    }
  }

  showSelected(square: string): void {
    this.clearSelected();

    const pos = algebraicToWorld(square);
    const geometry = new THREE.PlaneGeometry(SQUARE_SIZE * 0.95, SQUARE_SIZE * 0.95);
    const material = new THREE.MeshBasicMaterial({
      color: COLORS.selectedHighlight,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });

    this.selectedHighlight = new THREE.Mesh(geometry, material);
    this.selectedHighlight.rotation.x = -Math.PI / 2;
    this.selectedHighlight.position.set(pos.x, 0.015, pos.z);
    this.scene.add(this.selectedHighlight);
  }

  showLastMove(from: string, to: string): void {
    this.clearLastMove();

    for (const square of [from, to]) {
      const pos = algebraicToWorld(square);
      const geometry = new THREE.PlaneGeometry(SQUARE_SIZE * 0.95, SQUARE_SIZE * 0.95);
      const material = new THREE.MeshBasicMaterial({
        color: COLORS.lastMoveHighlight,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(pos.x, 0.012, pos.z);
      this.scene.add(mesh);
      this.lastMoveHighlights.push(mesh);
    }
  }

  showCheck(square: string): void {
    this.clearCheck();

    const pos = algebraicToWorld(square);
    const geometry = new THREE.RingGeometry(SQUARE_SIZE * 0.3, SQUARE_SIZE * 0.48, 32);
    const material = new THREE.MeshBasicMaterial({
      color: COLORS.checkHighlight,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.checkHighlight = new THREE.Mesh(geometry, material);
    this.checkHighlight.rotation.x = -Math.PI / 2;
    this.checkHighlight.position.set(pos.x, 0.025, pos.z);
    this.scene.add(this.checkHighlight);
  }

  clearAll(): void {
    this.clearValidMoves();
    this.clearSelected();
    this.clearLastMove();
    this.clearCheck();
  }

  clearValidMoves(): void {
    for (const indicator of this.validMoveIndicators) {
      this.scene.remove(indicator);
    }
    this.validMoveIndicators = [];
  }

  private clearSelected(): void {
    if (this.selectedHighlight) {
      this.scene.remove(this.selectedHighlight);
      this.selectedHighlight = null;
    }
  }

  private clearLastMove(): void {
    for (const mesh of this.lastMoveHighlights) {
      this.scene.remove(mesh);
    }
    this.lastMoveHighlights = [];
  }

  private clearCheck(): void {
    if (this.checkHighlight) {
      this.scene.remove(this.checkHighlight);
      this.checkHighlight = null;
    }
  }

  update(): void {
    // Pulsing effect on check highlight
    if (this.checkHighlight) {
      const time = this.clock.getElapsedTime();
      const opacity = 0.4 + Math.sin(time * 4) * 0.3;
      (this.checkHighlight.material as THREE.MeshBasicMaterial).opacity = opacity;
    }

    // Gentle pulse on valid move indicators
    if (this.validMoveIndicators.length > 0) {
      const time = this.clock.getElapsedTime();
      const opacity = 0.4 + Math.sin(time * 3) * 0.2;
      for (const indicator of this.validMoveIndicators) {
        (indicator.material as THREE.MeshBasicMaterial).opacity = opacity;
      }
    }
  }
}
