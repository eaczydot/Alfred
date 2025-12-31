import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Theme } from '@/constants/theme';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'default' | 'accent' | 'outline' | 'warn' | 'success' | 'glass';
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Badge({ label, variant = 'default', style, textStyle, icon, ...props }: BadgeProps) {
  if (variant === 'glass') {
     const glassToken = Theme.tokens.glass.depth2;
     return (
      <View style={[styles.base, styles.glass, style]} {...props}>
         {Platform.OS !== 'web' && (
           <View style={[StyleSheet.absoluteFill, { borderRadius: Theme.tokens.radius.pill, overflow: 'hidden' }]}>
            <BlurView intensity={glassToken.intensity} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: glassToken.backgroundColor }]} />
           </View>
         )}
         <View style={styles.contentRow}>
          {icon && <View style={{marginRight: 4}}>{icon}</View>}
          <Text style={[styles.text, styles.textGlass, textStyle]}>{label}</Text>
         </View>
      </View>
     );
  }

  return (
    <View style={[styles.base, styles[variant], style]} {...props}>
      <View style={styles.contentRow}>
        {icon && <View style={{marginRight: 4}}>{icon}</View>}
        <Text style={[styles.text, styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles], textStyle]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Theme.tokens.radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  default: {
    backgroundColor: Theme.tokens.color.surface.card,
    borderColor: Theme.tokens.color.border.default,
  },
  accent: {
    backgroundColor: Theme.tokens.color.accent.primary,
    borderColor: Theme.tokens.color.accent.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Theme.tokens.color.border.default,
  },
  warn: {
    backgroundColor: Theme.tokens.color.status.warn,
    borderColor: Theme.tokens.color.status.warn,
  },
  success: {
    backgroundColor: Theme.tokens.color.status.ok,
    borderColor: Theme.tokens.color.status.ok,
  },
  glass: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...Platform.select({
      web: {
        backgroundColor: 'rgba(60, 65, 75, 0.3)',
        backdropFilter: 'blur(45px) saturate(200%)',
      },
      default: {
         // handled by BlurView
         backgroundColor: 'transparent',
      }
    })
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textDefault: {
    color: Theme.tokens.color.text.primary,
  },
  textAccent: {
    color: Theme.tokens.color.text.onAccent,
  },
  textOutline: {
    color: Theme.tokens.color.text.secondary,
  },
  textWarn: {
    color: '#fff',
  },
  textSuccess: {
    color: '#fff',
  },
  textGlass: {
    color: Theme.tokens.color.text.primary,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});
