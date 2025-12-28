import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, TextStyle, Platform, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Theme } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  textStyle?: TextStyle;
  loading?: boolean;
}

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  style, 
  textStyle,
  onPress,
  loading = false,
  disabled = false,
  ...props 
}: ButtonProps) {
  
  const isDisabled = loading || disabled;

  const handlePress = (e: any) => {
    if (isDisabled) return;
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
        isDisabled && styles.disabled,
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isDisabled}
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#000' : Theme.tokens.color.text.primary}
          size="small"
        />
      ) : (
        <>
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
        </>
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
  disabled: {
    opacity: 0.5,
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
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  md: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  // Text Styles
  text: {
    fontWeight: '600',
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
    fontSize: 12,
  },
  textSizeMd: {
    fontSize: 14,
  },
  textSizeLg: {
    fontSize: 16,
  },
});
