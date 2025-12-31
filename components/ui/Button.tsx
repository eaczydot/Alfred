import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, TextStyle, Platform, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Theme } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'liquid';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  style, 
  textStyle,
  onPress,
  fullWidth,
  ...props 
}: ButtonProps) {
  
  const handlePress = (e: any) => {
    if (Platform.OS !== 'web') {
      const hapticStyle = variant === 'liquid' 
        ? Haptics.ImpactFeedbackStyle.Heavy 
        : Haptics.ImpactFeedbackStyle.Light;
      Haptics.impactAsync(hapticStyle);
    }
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      {...props}
    >
      {icon}
      {title && (
        <Text style={[
          styles.text, 
          styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles],
          styles[`textSize${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
          icon ? { marginLeft: 8 } : {},
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.tokens.radius.pill,
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  // Variants
  primary: {
    backgroundColor: Theme.tokens.color.accent.primary,
    borderColor: Theme.tokens.color.accent.primary,
    ...Theme.tokens.shadow.glow,
  },
  secondary: {
    backgroundColor: Theme.tokens.color.surface.card,
    borderColor: Theme.tokens.color.border.default,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: Theme.tokens.color.border.default,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      }
    })
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  liquid: {
    // Active state defined in logic or simplified here as the "Active" look
    backgroundColor: Theme.tokens.color.accent.primary,
    borderColor: 'transparent',
    // Inner glow simulated with shadow for now
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  // Sizes
  sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  md: {
    paddingVertical: 12, // Increased for touch targets
    paddingHorizontal: 20,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  // Text Styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Theme.tokens.typography.fontFamily.ui,
  },
  textPrimary: {
    color: Theme.tokens.color.text.onAccent,
  },
  textSecondary: {
    color: Theme.tokens.color.text.primary,
  },
  textGlass: {
    color: Theme.tokens.color.text.primary,
  },
  textGhost: {
    color: Theme.tokens.color.text.secondary,
  },
  textLiquid: {
    color: Theme.tokens.color.text.onAccent,
    fontWeight: '700',
  },
  // Text Sizes
  textSizeSm: {
    fontSize: 12,
  },
  textSizeMd: {
    fontSize: 14,
  },
  textSizeLg: {
    fontSize: 16,
  },
});
