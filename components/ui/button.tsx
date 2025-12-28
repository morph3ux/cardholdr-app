import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Colors, BorderRadius, ComponentSize, FontFamily, FontSize, Spacing } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: ButtonVariant;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  style,
  leftIcon,
  rightIcon,
  disabled,
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const sizeStyles = {
    small: {
      height: 36,
      paddingHorizontal: Spacing.sm,
      fontSize: FontSize.subhead,
    },
    medium: {
      height: ComponentSize.buttonHeight,
      paddingHorizontal: Spacing.md,
      fontSize: FontSize.body,
    },
    large: {
      height: 56,
      paddingHorizontal: Spacing.lg,
      fontSize: FontSize.title3,
    },
  };

  const currentSize = sizeStyles[size];

  const getTextColor = () => {
    if (disabled) return Colors.muted;
    switch (variant) {
      case 'primary':
        return Colors.charcoal;
      case 'secondary':
        return Colors.foreground;
      case 'ghost':
        return Colors.coral;
      case 'destructive':
        return Colors.foreground;
      default:
        return Colors.foreground;
    }
  };

  const content = (
    <>
      {leftIcon}
      <ThemedText
        style={[
          styles.text,
          { fontSize: currentSize.fontSize, color: getTextColor() },
          leftIcon ? { marginLeft: Spacing.xs } : null,
          rightIcon ? { marginRight: Spacing.xs } : null,
        ]}>
        {title}
      </ThemedText>
      {rightIcon}
    </>
  );

  if (variant === 'primary' && !disabled) {
    return (
      <AnimatedPressable
        style={[
          animatedStyle,
          fullWidth && styles.fullWidth,
          { opacity: disabled ? 0.5 : 1 },
          style,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        {...rest}>
        <LinearGradient
          colors={[Colors.coral, Colors.coralDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button,
            {
              height: currentSize.height,
              paddingHorizontal: currentSize.paddingHorizontal,
            },
          ]}>
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        styles.button,
        {
          height: currentSize.height,
          paddingHorizontal: currentSize.paddingHorizontal,
        },
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'destructive' && styles.destructive,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      {...rest}>
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  secondary: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  destructive: {
    backgroundColor: Colors.destructive,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: FontFamily.medium,
  },
});

