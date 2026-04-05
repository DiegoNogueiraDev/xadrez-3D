import { useCallback } from 'react';
import { useGameStore } from '../stores/useGameStore';
import type { ThreeEvent } from '@react-three/fiber';

export function useSquareInteraction(square: string) {
  const selectSquare = useGameStore((s) => s.selectSquare);
  const selectedSquare = useGameStore((s) => s.selectedSquare);
  const legalMoves = useGameStore((s) => s.legalMoves);

  const onClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectSquare(square);
  }, [selectSquare, square]);

  const onPointerOver = useCallback((e?: any) => {
    if (e?.stopPropagation) e.stopPropagation();
    document.body.style.cursor = 'pointer';
  }, []);

  const onPointerOut = useCallback(() => {
    document.body.style.cursor = 'auto';
  }, []);

  return {
    onClick,
    onPointerOver,
    onPointerOut,
    isSelected: selectedSquare === square,
    isLegalMove: legalMoves.includes(square),
  };
}
