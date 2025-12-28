import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { BarcodeDisplay, type BarcodeType } from './barcode-display';
import { Colors, CardGradients, BorderRadius, Shadows, Spacing, type CardGradientKey } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type LoyaltyCardData = {
  id: string;
  name: string;
  cardNumber: string;
  barcodeType: BarcodeType;
  color: CardGradientKey | string;
  logoUrl?: string;
  notes?: string;
  createdAt: number;
};

export type LoyaltyCardProps = {
  card: LoyaltyCardData;
  onPress?: () => void;
  onLongPress?: () => void;
  showBarcode?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
};

const CARD_ASPECT_RATIO = 1.586; // Standard credit card ratio

export function LoyaltyCard({
  card,
  onPress,
  onLongPress,
  showBarcode = true,
  size = 'medium',
  style,
}: LoyaltyCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.();
  };

  const sizeStyles = {
    small: { width: 160, height: 160 / CARD_ASPECT_RATIO },
    medium: { width: '100%' as const, aspectRatio: CARD_ASPECT_RATIO },
    large: { width: '100%' as const, aspectRatio: CARD_ASPECT_RATIO },
  };

  const getGradientColors = (): [string, string] => {
    if (card.color in CardGradients) {
      return CardGradients[card.color as CardGradientKey] as [string, string];
    }
    // If it's a custom hex color, create a gradient
    return [card.color, adjustBrightness(card.color, -20)];
  };

  const gradientColors = getGradientColors();

  return (
    <AnimatedPressable
      style={[animatedStyle, sizeStyles[size], style]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, Shadows.card]}>
        {/* Card Header */}
        <View style={styles.header}>
          <ThemedText
            type="title3"
            style={styles.cardName}
            numberOfLines={1}
            ellipsizeMode="tail">
            {card.name}
          </ThemedText>
        </View>

        {/* Barcode Section */}
        {showBarcode && (
          <View style={styles.barcodeContainer}>
            <BarcodeDisplay
              value={card.cardNumber}
              type={card.barcodeType}
              width={size === 'small' ? 120 : 240}
              height={size === 'small' ? 50 : 70}
              showValue={size !== 'small'}
              backgroundColor={Colors.white}
              lineColor={Colors.charcoal}
            />
          </View>
        )}

        {/* Card Number Footer */}
        {!showBarcode && (
          <View style={styles.footer}>
            <ThemedText type="caption" style={styles.cardNumber}>
              {formatCardNumber(card.cardNumber)}
            </ThemedText>
          </View>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
}

// Helper to adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Format card number with spaces
function formatCardNumber(number: string): string {
  return number.replace(/(.{4})/g, '$1 ').trim();
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardName: {
    color: Colors.white,
    fontWeight: '600',
    flex: 1,
  },
  barcodeContainer: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  footer: {
    marginTop: Spacing.sm,
  },
  cardNumber: {
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 2,
  },
});

