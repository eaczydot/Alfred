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
  text: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
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
    color: Theme.tokens.color.text.primary,
  },
  textSuccess: {
    color: Theme.tokens.color.text.primary,
  },
});
