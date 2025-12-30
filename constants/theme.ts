import { Platform } from 'react-native';

const uiFont =
  Platform.select({
    ios: 'SF Pro Display',
    android: 'sans-serif-medium',
    web: 'Inter, system-ui, -apple-system, sans-serif',
    default: 'System'
  }) || 'System';

const monoFont =
  Platform.select({
    ios: 'SFMono-Regular',
    android: 'monospace',
    web: 'Menlo, SFMono-Regular, ui-monospace, monospace',
    default: 'monospace'
  }) || 'monospace';

export const Theme = {
  tokens: {
    color: {
      bg: ['#030712', '#050b18', '#0a1224'],
      surface: {
        card: 'rgba(255,255,255,0.04)',
        raised: 'rgba(255,255,255,0.06)'
      },
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        tertiary: '#94a3b8'
      },
      border: {
        default: 'rgba(255,255,255,0.08)',
        accent: 'rgba(0,229,255,0.35)'
      },
      accent: {
        primary: '#00e5ff',
        secondary: '#8b5cf6',
        info: '#fbbf24'
      },
      status: {
        ok: '#22c55e',
        warn: '#f59e0b',
        urgent: '#ef4444'
      }
    },
    typography: {
      fontFamily: {
        ui: uiFont,
        mono: monoFont
      }
    },
    radius: {
      sm: 8,
      md: 12,
      lg: 16,
      pill: 999
    },
    shadow: {
      soft: {
        shadowColor: '#00e5ff',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8
      },
      glow: {
        shadowColor: '#fbbf24',
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6
      }
    }
  }
};
