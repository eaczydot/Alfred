import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, TextStyle, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Theme } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  textStyle?: TextStyle;
}

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  style, 
  textStyle,
  onPress,
  ...props 
}: ButtonProps) {
  
  const handlePress = (e: any) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
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
          icon ? { marginLeft: Theme.tokens.spacing.sm } : {},
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
  // Variants
  primary: {
    backgroundColor: Theme.tokens.color.accent.primary,
    borderColor: Theme.tokens.color.accent.primary,
  },
  secondary: {
    backgroundColor: Theme.tokens.color.surface.card,
    borderColor: Theme.tokens.color.border.default,
  },
  glass: {
    backgroundColor: 'rgba(0,0,0,0.35)', // mapped to glass from old colors
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
  // Sizes
  sm: {
    paddingVertical: Theme.tokens.spacing.sm,
    paddingHorizontal: Theme.tokens.spacing.md,
  },
  md: {
    paddingVertical: Theme.tokens.spacing.md,
    paddingHorizontal: Theme.tokens.spacing.lg,
  },
  lg: {
    paddingVertical: Theme.tokens.spacing.lg,
    paddingHorizontal: Theme.tokens.spacing.xxl,
  },
  // Text Styles
  text: {
    fontWeight: Theme.tokens.typography.weight.semibold as TextStyle['fontWeight'],
    textAlign: 'center',
    fontFamily: Theme.tokens.typography.fontFamily.ui,
  },
  textPrimary: {
    color: '#000', // Black text for better contrast on bright Cyan
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
  // Text Sizes
  textSizeSm: {
    fontSize: Theme.tokens.typography.size.caption,
    lineHeight: Theme.tokens.typography.lineHeight.caption,
  },
  textSizeMd: {
    fontSize: Theme.tokens.typography.size.bodySm,
    lineHeight: Theme.tokens.typography.lineHeight.bodySm,
  },
  textSizeLg: {
    fontSize: Theme.tokens.typography.size.body,
    lineHeight: Theme.tokens.typography.lineHeight.body,
  },
});
