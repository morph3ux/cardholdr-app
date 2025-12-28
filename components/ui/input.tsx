import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, BorderRadius, ComponentSize, FontFamily, FontSize, Spacing } from '@/constants/theme';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
};

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return Colors.destructive;
    if (isFocused) return Colors.coral;
    return Colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText type="subhead" style={styles.label}>
          {label}
        </ThemedText>
      )}
      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() },
          isFocused && styles.inputFocused,
        ]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            style,
          ]}
          placeholderTextColor={Colors.muted}
          selectionColor={Colors.coral}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && (
        <ThemedText type="caption" color="destructive" style={styles.error}>
          {error}
        </ThemedText>
      )}
      {hint && !error && (
        <ThemedText type="caption" color="muted" style={styles.hint}>
          {hint}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: Spacing.xs,
    color: Colors.foreground,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ComponentSize.inputHeight,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
  },
  inputFocused: {
    borderWidth: 2,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: Spacing.md,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.body,
    color: Colors.foreground,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: Spacing.xs,
  },
  iconLeft: {
    paddingLeft: Spacing.md,
  },
  iconRight: {
    paddingRight: Spacing.md,
  },
  error: {
    marginTop: Spacing.xxs,
  },
  hint: {
    marginTop: Spacing.xxs,
  },
});

