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
      bg: ['#010101', '#0f111a', '#1a1a1a'],
      surface: {
        card: 'rgba(255,255,255,0.05)',
        raised: 'rgba(255,255,255,0.08)'
      },
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255,255,255,0.72)',
        tertiary: 'rgba(255,255,255,0.48)',
        onAccent: '#ffffff'
      },
      border: {
        default: 'rgba(255,255,255,0.12)',
        accent: 'rgba(5,64,244,0.45)'
      },
      accent: {
        primary: '#0540F4',
        secondary: '#0b6bff',
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
        shadowColor: '#000',
        shadowOpacity: 0.24,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6
      },
      glow: {
        shadowColor: '#0540F4',
        shadowOpacity: 0.16,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4
      }
    }
  }
};
