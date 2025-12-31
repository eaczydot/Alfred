import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Theme } from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'glass';
  depth?: 0 | 1 | 2 | 3;
  children?: React.ReactNode;
}

export function Card({ style, variant = 'default', depth = 1, children, ...props }: CardProps) {
  const glassToken = Theme.tokens.glass[`depth${depth}` as keyof typeof Theme.tokens.glass];

  if (variant === 'glass') {
    // For web, we can use backdropFilter if we pass it to style (React Native Web supports it often, or we ignore it if strictly typed)
    // We'll construct the style object carefully.
    
    const webStyle = Platform.OS === 'web' ? {
      backgroundColor: glassToken.backgroundColor,
      backdropFilter: glassToken.backdropFilter,
      boxShadow: `${glassToken.shadowOffset?.width}px ${glassToken.shadowOffset?.height}px ${glassToken.shadowRadius}px ${glassToken.shadowColor}`,
    } : {};

    const nativeShadow = Platform.OS !== 'web' ? {
      shadowColor: glassToken.shadowColor,
      shadowOffset: glassToken.shadowOffset,
      shadowOpacity: glassToken.shadowOpacity,
      shadowRadius: glassToken.shadowRadius,
      elevation: glassToken.elevation,
    } : {};

    return (
      <View 
        style={[
          styles.card, 
          { borderColor: glassToken.borderColor },
          // @ts-ignore
          webStyle,
          nativeShadow,
          style
        ]} 
        {...props}
      >
        {Platform.OS !== 'web' && (
          <View style={[StyleSheet.absoluteFill, { borderRadius: Theme.tokens.radius.lg, overflow: 'hidden' }]}>
             <BlurView intensity={glassToken.intensity} tint="dark" style={StyleSheet.absoluteFill} />
             <View style={[StyleSheet.absoluteFill, { backgroundColor: glassToken.backgroundColor }]} />
          </View>
        )}
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
    borderWidth: 1,
    borderRadius: Theme.tokens.radius.lg,
    padding: 22,
    // overflow: 'hidden', // Removing overflow hidden from parent to allow shadows on native? No, usually card has overflow hidden for children, but shadow needs to be on wrapper.
    // For glass, we usually need a wrapper for shadow and inner for overflow/blur. 
    // Simplified for now: assuming overflow hidden is okay or handled by user if they need outside shadow on native.
    // Actually, for BlurView to work bounded, we need overflow hidden on the container of the blur.
  },
  defaultContainer: {
    backgroundColor: Theme.tokens.color.surface.card,
    borderColor: Theme.tokens.color.border.default,
    ...Theme.tokens.shadow.soft,
  },
  content: {
    zIndex: 1,
  }
});
