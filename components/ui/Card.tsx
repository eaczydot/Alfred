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
    borderRadius: Theme.tokens.radius.lg, // 16 matches closer to 18
    padding: Theme.tokens.spacing.xl + Theme.tokens.spacing.xs,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.22,
    shadowRadius: 35,
    elevation: 5,
    overflow: 'hidden',
  },
  defaultContainer: {
    backgroundColor: Theme.tokens.color.surface.card,
  },
  glassContainer: {
    backgroundColor: Platform.select({
      web: 'rgba(11, 15, 24, 0.6)', 
      default: 'rgba(11, 15, 24, 0.4)' // Slightly more transparent on native to let blur do work
    }),
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        shadowColor: "transparent",
      },
      default: {
        shadowColor: "transparent",
      }
    }),
  },
  content: {
    zIndex: 1,
  }
});
