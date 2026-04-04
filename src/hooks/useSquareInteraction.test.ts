import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameStore } from '../stores/useGameStore';
import { useSquareInteraction } from './useSquareInteraction';

describe('useSquareInteraction', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
    useGameStore.getState().setGamePhase('playing');
  });

  it('returns onClick and onPointerOver and onPointerOut handlers', () => {
    const { result } = renderHook(() => useSquareInteraction('e2'));
    expect(typeof result.current.onClick).toBe('function');
    expect(typeof result.current.onPointerOver).toBe('function');
    expect(typeof result.current.onPointerOut).toBe('function');
  });

  it('onClick calls selectSquare with the square name', () => {
    const spy = vi.spyOn(useGameStore.getState(), 'selectSquare');
    const { result } = renderHook(() => useSquareInteraction('e2'));
    act(() => {
      result.current.onClick();
    });
    expect(spy).toHaveBeenCalledWith('e2');
    spy.mockRestore();
  });

  it('clicking own piece selects it', () => {
    const { result } = renderHook(() => useSquareInteraction('e2'));
    act(() => {
      result.current.onClick();
    });
    expect(useGameStore.getState().selectedSquare).toBe('e2');
    expect(useGameStore.getState().legalMoves.length).toBeGreaterThan(0);
  });

  it('clicking same piece again deselects', () => {
    const { result } = renderHook(() => useSquareInteraction('e2'));
    act(() => {
      result.current.onClick();
    });
    act(() => {
      result.current.onClick();
    });
    expect(useGameStore.getState().selectedSquare).toBeNull();
  });

  it('clicking a legal move square after selection executes the move', () => {
    // Select e2
    act(() => {
      useGameStore.getState().selectSquare('e2');
    });
    expect(useGameStore.getState().legalMoves).toContain('e4');

    // Click e4 to move
    const { result } = renderHook(() => useSquareInteraction('e4'));
    act(() => {
      result.current.onClick();
    });
    expect(useGameStore.getState().turn).toBe('b');
    expect(useGameStore.getState().selectedSquare).toBeNull();
  });

  it('returns isSelected true when the square is the selected square', () => {
    act(() => {
      useGameStore.getState().selectSquare('e2');
    });
    const { result } = renderHook(() => useSquareInteraction('e2'));
    expect(result.current.isSelected).toBe(true);
  });

  it('returns isLegalMove true when the square is a legal move target', () => {
    act(() => {
      useGameStore.getState().selectSquare('e2');
    });
    const { result } = renderHook(() => useSquareInteraction('e4'));
    expect(result.current.isLegalMove).toBe(true);
  });

  it('returns isLegalMove false when the square is not a legal target', () => {
    act(() => {
      useGameStore.getState().selectSquare('e2');
    });
    const { result } = renderHook(() => useSquareInteraction('a5'));
    expect(result.current.isLegalMove).toBe(false);
  });
});
