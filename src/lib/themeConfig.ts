import type { ThemeMode } from '../stores/useSettingsStore';

export interface ThemeColors {
  background: string;
  text: string;
  accent: string;
  surface: string;
  border: string;
}

export const THEME_CONFIG: Record<ThemeMode, ThemeColors> = {
  dark: {
    background: '#0A0A0F',
    text: '#F5F5F5',
    accent: '#FFD700',
    surface: '#1A1A2E',
    border: '#333344',
  },
  light: {
    background: '#F8F8F8',
    text: '#1A1A1A',
    accent: '#B8860B',
    surface: '#FFFFFF',
    border: '#D4D4D4',
  },
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
} as const;

export function getThemeColors(theme: ThemeMode): ThemeColors {
  return THEME_CONFIG[theme];
}
