import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { Theme } from '@/constants/theme';

interface ToastProps {
  message: string;
  duration?: number;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onHide());
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, fadeAnim, onHide]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <CheckCircle size={16} color={Theme.tokens.color.accent.primary} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: Theme.tokens.color.surface.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Theme.tokens.radius.large,
    borderWidth: 1,
    borderColor: Theme.tokens.color.border.default,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  message: {
    color: Theme.tokens.color.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
