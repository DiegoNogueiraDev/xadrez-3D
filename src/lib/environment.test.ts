import { describe, it, expect } from 'vitest';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from './environment';

describe('ENVIRONMENT_CONFIG', () => {
  it('exports an object with path, sourceId, resolution, and label', () => {
    expect(ENVIRONMENT_CONFIG).toHaveProperty('path');
    expect(ENVIRONMENT_CONFIG).toHaveProperty('sourceId');
    expect(ENVIRONMENT_CONFIG).toHaveProperty('resolution');
    expect(ENVIRONMENT_CONFIG).toHaveProperty('label');
  });

  it('path === /assets/environment/medieval.hdr', () => {
    expect(ENVIRONMENT_CONFIG.path).toBe('/assets/environment/medieval.hdr');
  });

  it('resolution === 1k for web performance', () => {
    expect(ENVIRONMENT_CONFIG.resolution).toBe('1k');
  });

  it('sourceId matches the Polyhaven abandoned_hall_01 asset', () => {
    expect(ENVIRONMENT_CONFIG.sourceId).toBe('abandoned_hall_01');
  });

  it('label describes the HDRI environment', () => {
    expect(ENVIRONMENT_CONFIG.label).toBe('Medieval Hall');
  });

  it('path ends with .hdr extension for HDR format', () => {
    expect(ENVIRONMENT_CONFIG.path).toMatch(/\.hdr$/);
  });

  it('config satisfies EnvironmentConfig interface', () => {
    const config: EnvironmentConfig = ENVIRONMENT_CONFIG;
    expect(config).toBeDefined();
    expect(Object.keys(config)).toEqual(['path', 'sourceId', 'resolution', 'label']);
  });
});
