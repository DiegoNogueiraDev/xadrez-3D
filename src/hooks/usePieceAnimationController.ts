import { useCallback } from 'react';
import { useAnimations } from '@react-three/drei';
import type { AnimationClip } from 'three';
import type { RefObject } from 'react';
import * as THREE from 'three';

export function usePieceAnimationController(
  animations: AnimationClip[],
  groupRef: RefObject<THREE.Group>,
  pieceName: string
) {
  const { actions } = useAnimations(animations, groupRef);

  const playAction = useCallback(
    (actionName: string, loop: boolean = false) => {
      const action = actions[actionName];
      if (!action) return;
      if (!loop) {
        action.clampWhenFinished = true;
        action.setLoop(THREE.LoopOnce, 1);
      } else {
        action.setLoop(THREE.LoopRepeat, Infinity);
      }
      action.reset().play();
    },
    [actions]
  );

  const playIdle = useCallback(() => {
    playAction(`${pieceName}_idle`, true);
  }, [playAction, pieceName]);

  const playCapture = useCallback(() => {
    playAction(`${pieceName}_capture`, false);
  }, [playAction, pieceName]);

  const playPromote = useCallback(() => {
    playAction(`${pieceName}_promote`, false);
  }, [playAction, pieceName]);

  return { playIdle, playCapture, playPromote };
}
