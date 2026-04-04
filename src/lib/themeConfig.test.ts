import { describe, it, expect } from 'vitest';
import { THEME_CONFIG, BREAKPOINTS, getThemeColors } from './themeConfig';

describe('THEME_CONFIG', () => {
  it('has dark and light theme definitions', () => {
    expect(THEME_CONFIG.dark).toBeDefined();
    expect(THEME_CONFIG.light).toBeDefined();
  });

  it('each theme has background, text, accent colors', () => {
    for (const theme of ['dark', 'light'] as const) {
      expect(THEME_CONFIG[theme].background).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(THEME_CONFIG[theme].text).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(THEME_CONFIG[theme].accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});

describe('BREAKPOINTS', () => {
  it('sm = 640', () => {
    expect(BREAKPOINTS.sm).toBe(640);
  });

  it('md = 768', () => {
    expect(BREAKPOINTS.md).toBe(768);
  });

  it('lg = 1024', () => {
    expect(BREAKPOINTS.lg).toBe(1024);
  });
});

describe('getThemeColors', () => {
  it('returns dark colors for dark theme', () => {
    expect(getThemeColors('dark')).toBe(THEME_CONFIG.dark);
  });

  it('returns light colors for light theme', () => {
    expect(getThemeColors('light')).toBe(THEME_CONFIG.light);
  });
});
