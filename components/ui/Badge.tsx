import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextStyle } from 'react-native';
import { Theme } from '@/constants/theme';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'default' | 'accent' | 'outline' | 'warn' | 'success';
  textStyle?: TextStyle;
}

export function Badge({ label, variant = 'default', style, textStyle, ...props }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], style]} {...props}>
      <Text style={[styles.text, styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles], textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  accent: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)', // Cyan with opacity to match accent.primary
    borderColor: Theme.tokens.color.border.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Theme.tokens.color.border.default,
  },
  warn: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  success: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  textDefault: {
    color: Theme.tokens.color.text.primary,
  },
  textAccent: {
    color: Theme.tokens.color.accent.primary,
  },
  textOutline: {
    color: Theme.tokens.color.text.secondary,
  },
  textWarn: {
    color: Theme.tokens.color.status.warn,
  },
  textSuccess: {
    color: Theme.tokens.color.status.ok,
  },
});
