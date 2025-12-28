import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { Colors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

export type CardProps = ViewProps & {
  variant?: 'default' | 'elevated' | 'glass';
  noPadding?: boolean;
};

export function Card({ variant = 'default', noPadding = false, style, children, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        variant === 'default' && styles.default,
        variant === 'elevated' && styles.elevated,
        variant === 'glass' && styles.glass,
        !noPadding && styles.padding,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  elevated: {
    backgroundColor: Colors.surfaceLight,
    ...Shadows.elevated,
  },
  glass: {
    backgroundColor: 'rgba(19, 23, 30, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(38, 44, 54, 0.5)',
  },
  padding: {
    padding: Spacing.md,
  },
});

