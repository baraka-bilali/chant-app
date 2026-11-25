export const Colors = {
  light: {
    background: '#f5f6f8',
    surface: '#ffffff',
    text: '#0b0c0f',
    muted: '#6b7280',
    border: '#e5e7eb',
    accent: '#3b82f6',
    onAccent: '#ffffff',
    danger: '#ef4444',
    chorusBackground: '#eef4ff',
  },
  dark: {
    background: '#0b0c0f',
    surface: '#12151b',
    text: '#e5e7eb',
    muted: '#9ca3af',
    border: '#1f2937',
    accent: '#60a5fa',
    onAccent: '#0b0c0f',
    danger: '#f87171',
    chorusBackground: '#14203a',
  },
} as const;

export type ThemeColors = (typeof Colors)[keyof typeof Colors];

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

export const MaxContentWidth = 720;
