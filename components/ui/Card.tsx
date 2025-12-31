import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Theme } from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'glass';
  intensity?: number;
}

export function Card({ style, variant = 'default', intensity = 20, children, ...props }: CardProps) {
  if (variant === 'glass') {
    return (
      <View style={[styles.card, styles.glassContainer, style]} {...props}>
        {Platform.OS !== 'web' && (
          <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
        )}
        {/* On web, we handle blur via CSS in styles.glassContainer */}
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View 
      style={[
        styles.card, 
        styles.defaultContainer,
        style
      ]} 
      {...props} 
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: Theme.tokens.color.border.default,
    borderWidth: 1,
    borderRadius: Theme.tokens.radius.lg,
    padding: 22,
    overflow: 'hidden',
    ...Theme.tokens.shadow.soft,
  },
  defaultContainer: {
    backgroundColor: Theme.tokens.color.surface.card,
  },
  glassContainer: {
    backgroundColor: Platform.select({
      web: Theme.tokens.color.surface.glassStrong,
      default: Theme.tokens.color.surface.glass, // Slightly more transparent on native to let blur do work
    }),
    borderColor: Theme.tokens.color.border.accent,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        shadowColor: Theme.tokens.color.accent.primary,
      },
      default: {
        shadowColor: Theme.tokens.color.accent.primary,
      }
    }),
  },
  content: {
    zIndex: 1,
  }
});
