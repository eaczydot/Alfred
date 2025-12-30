export const Theme = {
  tokens: {
    color: {
      bg: ['#07090F', '#0B1220'],
      surface: {
        card: '#0F172A',
      },
      text: {
        primary: '#E2E8F0',
        secondary: '#CBD5E1',
        tertiary: '#94A3B8',
      },
      accent: {
        primary: '#00E5FF',
        info: '#60A5FA',
      },
      border: {
        default: 'rgba(255, 255, 255, 0.12)',
        accent: 'rgba(0, 229, 255, 0.4)',
      },
      status: {
        ok: '#22C55E',
        warn: '#EAB308',
        urgent: '#EF4444',
      },
    },
    radius: {
      sm: 6,
      md: 12,
      lg: 16,
      pill: 999,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      xxl: 24,
    },
    typography: {
      fontFamily: {
        ui: 'Inter',
        mono: 'SpaceMono-Regular',
      },
      size: {
        headline: 24,
        body: 16,
        bodySm: 14,
        caption: 12,
      },
      lineHeight: {
        headline: 32,
        body: 24,
        bodySm: 20,
        caption: 16,
      },
      weight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
} as const;

export type ThemeType = typeof Theme;
