import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { ANIMATION } from '../utils/constants';

export class AnimationManager {
  animateMove(piece: THREE.Group, targetX: number, targetZ: number): Promise<void> {
    return new Promise((resolve) => {
      const startY = piece.position.y;
      const liftY = startY + ANIMATION.liftHeight;
      const halfDuration = ANIMATION.moveDuration / 2;

      // Phase 1: Lift up
      new TWEEN.Tween(piece.position)
        .to({ y: liftY }, halfDuration * 0.4)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          // Phase 2: Move horizontally while at peak height
          new TWEEN.Tween(piece.position)
            .to({ x: targetX, z: targetZ }, halfDuration * 1.2)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onComplete(() => {
              // Phase 3: Drop down
              new TWEEN.Tween(piece.position)
                .to({ y: startY }, halfDuration * 0.4)
                .easing(TWEEN.Easing.Quadratic.In)
                .onComplete(() => {
                  resolve();
                })
                .start();
            })
            .start();
        })
        .start();
    });
  }

  animateCapture(piece: THREE.Group): Promise<void> {
    return new Promise((resolve) => {
      const scaleTween = new TWEEN.Tween(piece.scale)
        .to({ x: 0, y: 0, z: 0 }, ANIMATION.captureDuration)
        .easing(TWEEN.Easing.Quadratic.In);

      // Fade out all child materials
      piece.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          new TWEEN.Tween(mat)
            .to({ opacity: 0 }, ANIMATION.captureDuration)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();
        }
      });

      scaleTween.onComplete(() => {
        resolve();
      });

      scaleTween.start();
    });
  }

  animateEntrance(piece: THREE.Group): void {
    const targetY = piece.position.y;
    piece.position.y = targetY + 2;
    piece.scale.setScalar(0);

    new TWEEN.Tween(piece.position)
      .to({ y: targetY }, 600)
      .easing(TWEEN.Easing.Bounce.Out)
      .start();

    new TWEEN.Tween(piece.scale)
      .to({ x: 1, y: 1, z: 1 }, 500)
      .easing(TWEEN.Easing.Back.Out)
      .start();
  }

  update(): void {
    TWEEN.update();
  }
}
