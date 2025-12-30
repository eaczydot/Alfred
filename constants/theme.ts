export const Theme = {
  tokens: {
    color: {
      bg: ['#05070D'],
      surface: {
        card: '#0B0F18',
        glass: 'rgba(11, 15, 24, 0.4)',
        glassStrong: 'rgba(11, 15, 24, 0.6)',
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#E2E8F0',
        tertiary: '#94A3B8',
      },
      accent: {
        primary: '#22D3EE',
        info: '#38BDF8',
      },
      status: {
        warn: '#F59E0B',
        ok: '#22C55E',
        urgent: '#EF4444',
      },
      border: {
        default: 'rgba(255, 255, 255, 0.08)',
        accent: '#22D3EE',
      },
    },
    radius: {
      lg: 16,
      pill: 9999,
    },
    typography: {
      fontFamily: {
        ui: 'System',
        mono: 'monospace',
      },
    },
  },
} as const;

export type ThemeType = typeof Theme;
