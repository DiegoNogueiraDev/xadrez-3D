import { describe, it, expect } from 'vitest';
import { ENVIRONMENT_CONFIG } from './environment';

describe('ENVIRONMENT_CONFIG', () => {
  it('exports an object with path, sourceId, resolution, and label', () => {
    expect(ENVIRONMENT_CONFIG).toHaveProperty('path');
    expect(ENVIRONMENT_CONFIG).toHaveProperty('sourceId');
    expect(ENVIRONMENT_CONFIG).toHaveProperty('resolution');
    expect(ENVIRONMENT_CONFIG).toHaveProperty('label');
  });

  it('path === /assets/environment/studio.hdr', () => {
    expect(ENVIRONMENT_CONFIG.path).toBe('/assets/environment/studio.hdr');
  });

  it('resolution === 1k for web performance', () => {
    expect(ENVIRONMENT_CONFIG.resolution).toBe('1k');
  });

  it('sourceId is a non-empty string matching a Polyhaven asset', () => {
    expect(typeof ENVIRONMENT_CONFIG.sourceId).toBe('string');
    expect(ENVIRONMENT_CONFIG.sourceId.length).toBeGreaterThan(0);
  });

  it('label is a descriptive non-empty string', () => {
    expect(typeof ENVIRONMENT_CONFIG.label).toBe('string');
    expect(ENVIRONMENT_CONFIG.label.length).toBeGreaterThan(0);
  });
});
