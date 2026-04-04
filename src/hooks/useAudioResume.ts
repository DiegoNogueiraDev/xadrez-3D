import { useEffect, useCallback } from 'react';
import { Howler } from 'howler';

export function useAudioResume() {
  const resume = useCallback(() => {
    const ctx = (Howler as any).ctx;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', resume, { once: true });
    document.addEventListener('touchstart', resume, { once: true });

    return () => {
      document.removeEventListener('click', resume);
      document.removeEventListener('touchstart', resume);
    };
  }, [resume]);
}
