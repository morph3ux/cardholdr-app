import { View, type ViewProps } from 'react-native';

import { Colors } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  variant?: 'charcoal' | 'surface' | 'surfaceLight' | 'transparent';
};

export function ThemedView({ style, variant = 'charcoal', ...otherProps }: ThemedViewProps) {
  const backgroundColor =
    variant === 'charcoal'
      ? Colors.charcoal
      : variant === 'surface'
        ? Colors.surface
        : variant === 'surfaceLight'
          ? Colors.surfaceLight
          : Colors.transparent;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
