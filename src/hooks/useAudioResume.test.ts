import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const { mockResume, mockHowler } = vi.hoisted(() => {
  const mockResume = vi.fn();
  const mockHowler = {
    ctx: { state: 'suspended', resume: mockResume },
  };
  return { mockResume, mockHowler };
});

vi.mock('howler', () => ({
  Howler: mockHowler,
}));

import { useAudioResume } from './useAudioResume';

describe('useAudioResume', () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockResume.mockClear();
    mockHowler.ctx.state = 'suspended';
    addSpy = vi.spyOn(document, 'addEventListener');
    removeSpy = vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('adds click and touchstart listeners on mount', () => {
    renderHook(() => useAudioResume());
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function), { once: true });
    expect(addSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), { once: true });
  });

  it('calls Howler.ctx.resume() when clicked', () => {
    renderHook(() => useAudioResume());
    // Simulate click
    document.dispatchEvent(new Event('click'));
    expect(mockResume).toHaveBeenCalled();
  });

  it('does not crash if Howler.ctx is null', () => {
    const origCtx = mockHowler.ctx;
    (mockHowler as any).ctx = null;
    expect(() => {
      renderHook(() => useAudioResume());
      document.dispatchEvent(new Event('click'));
    }).not.toThrow();
    mockHowler.ctx = origCtx;
  });

  it('removes listeners on unmount', () => {
    const { unmount } = renderHook(() => useAudioResume());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });

  it('skips resume if context is already running', () => {
    mockHowler.ctx.state = 'running';
    renderHook(() => useAudioResume());
    document.dispatchEvent(new Event('click'));
    expect(mockResume).not.toHaveBeenCalled();
  });
});
