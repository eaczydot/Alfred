import { Platform } from 'react-native';

const uiFont =
  Platform.select({
    ios: 'Inter Tight', // Fallback will handle if not loaded, but ideally should be loaded
    android: 'Inter Tight',
    web: 'Inter Tight, Inter, system-ui, -apple-system, sans-serif',
    default: 'System'
  }) || 'System';

const monoFont =
  Platform.select({
    ios: 'JetBrains Mono',
    android: 'JetBrains Mono',
    web: 'JetBrains Mono, monospace',
    default: 'monospace'
  }) || 'monospace';

// Helper to convert HSLA to string if needed, but we'll use string literals for now as per JSON
// JSON provided HSLA strings which are valid in React Native.

export const Theme = {
  meta: {
    system_name: "Refraction OS",
    version: "5.1.0-Alpha"
  },
  tokens: {
    color: {
      // Palette mapping
      obsidian_void: '#030304',
      liquid_azure: 'hsla(195, 100%, 75%, 0.85)',
      biolum_green: 'hsla(140, 100%, 60%, 0.7)',
      warning_ember: 'hsla(25, 100%, 65%, 0.6)',
      misted_white: 'hsla(0, 0%, 100%, 0.9)',
      vapor_grey: 'hsla(220, 20%, 80%, 0.4)',

      // Functional mapping to maintain compatibility with existing code while switching to new palette
      bg: ['#030304', '#0f111a', '#1a1a1a'], // obsidian_void at index 0
      surface: {
        card: 'rgba(255,255,255,0.05)', // Keep for fallback
        raised: 'rgba(255,255,255,0.08)',
        glass: 'rgba(11, 15, 24, 0.4)',
        glassStrong: 'rgba(11, 15, 24, 0.6)',
      },
      text: {
        primary: 'hsla(0, 0%, 100%, 0.9)', // misted_white
        secondary: 'hsla(220, 20%, 80%, 0.4)', // vapor_grey
        tertiary: 'rgba(255,255,255,0.48)',
        onAccent: '#030304' // obsidian_void for contrast on azure
      },
      border: {
        default: 'rgba(255, 255, 255, 0.08)',
        accent: 'hsla(195, 100%, 75%, 0.85)', // liquid_azure
        glass: 'rgba(255, 255, 255, 0.15)',
      },
      accent: {
        primary: 'hsla(195, 100%, 75%, 0.85)', // liquid_azure
        secondary: '#0b6bff', // Keep legacy for now
        info: '#fbbf24',
        success: 'hsla(140, 100%, 60%, 0.7)', // biolum_green
      },
      status: {
        ok: 'hsla(140, 100%, 60%, 0.7)', // biolum_green
        warn: 'hsla(25, 100%, 65%, 0.6)', // warning_ember
        urgent: '#ef4444'
      }
    },
    glass: {
      depth0: {
        backdropFilter: 'blur(0px)',
        backgroundColor: '#030304',
      },
      depth1: {
        backdropFilter: 'blur(25px) saturate(180%)',
        backgroundColor: 'rgba(30, 30, 35, 0.4)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 10,
        intensity: 25, // For native BlurView
      },
      depth2: {
        backdropFilter: 'blur(45px) saturate(200%)',
        backgroundColor: 'rgba(60, 65, 75, 0.3)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        // inner_glow handled in component via extra view or shadow tricks
        intensity: 45,
      },
      depth3: {
        backdropFilter: 'blur(60px) brightness(1.2)',
        backgroundColor: 'rgba(20, 20, 20, 0.6)',
        borderColor: 'rgba(255, 255, 255, 0.25)',
        shadowColor: 'rgba(0,0,0,0.7)',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.7,
        shadowRadius: 50,
        elevation: 20,
        intensity: 60,
      }
    },
    typography: {
      fontFamily: {
        ui: uiFont,
        mono: monoFont,
        primary: uiFont,
        data: monoFont,
      },
      tokens: {
        display_impact: {
          fontSize: 56,
          fontWeight: '800',
          letterSpacing: -2.5,
        },
        heading_lens: {
          fontSize: 32,
          fontWeight: '700',
          letterSpacing: -1,
          lineHeight: 35, // approx 1.1 * 32
        },
        body_glass: {
          fontSize: 16,
          fontWeight: '400',
          lineHeight: 24, // 1.5 * 16
          letterSpacing: 0.2,
        },
        label_technical: {
          fontSize: 11,
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          fontFamily: monoFont,
        }
      }
    },
    radius: {
      sm: 8,
      md: 12,
      lg: 16, // Matches depth definitions usually
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
        shadowColor: 'hsla(195, 100%, 75%, 0.85)', // liquid_azure
        shadowOpacity: 0.16,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4
      }
    },
    motion: {
      durations: {
        instant: 150,
        fluid: 400,
        lazy: 800,
      },
      // Curves (Bezier strings for CSS/Reanimated, or simple Easing for RN)
      // We'll store strings for reanimated, and maybe mapped objects for LayoutAnimation if needed
      curves: {
        liquid_snap: [0.19, 1, 0.22, 1], // Cubic bezier points
        viscous_drag: [0.23, 1, 0.32, 1],
        refraction_shimmer: [0, 0, 1, 1], // Linear
      }
    }
  }
} as const; // 'as const' to infer literal types where possible
