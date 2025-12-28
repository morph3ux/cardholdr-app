import { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Brightness from 'expo-brightness';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BarcodeDisplay } from '@/components/ui/barcode-display';
import { Button } from '@/components/ui/button';
import { useCard } from '@/hooks/use-cards';
import { Colors, CardGradients, Spacing, BorderRadius, Shadows, type CardGradientKey } from '@/constants/theme';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { card, isLoading, deleteCard } = useCard(id);

  // Boost brightness when viewing barcode
  useEffect(() => {
    let originalBrightness: number | null = null;

    async function boostBrightness() {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          originalBrightness = await Brightness.getBrightnessAsync();
          await Brightness.setBrightnessAsync(1);
        }
      } catch (error) {
        // Brightness control may not be available
      }
    }

    boostBrightness();

    return () => {
      if (originalBrightness !== null) {
        Brightness.setBrightnessAsync(originalBrightness);
      }
    };
  }, []);

  const handleEdit = useCallback(() => {
    router.push(`/edit-card/${id}`);
  }, [router, id]);

  const handleDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Delete Card', `Are you sure you want to delete "${card?.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCard();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        },
      },
    ]);
  }, [card, deleteCard, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (isLoading || !card) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.loadingContainer}>
          <ThemedText type="body" color="muted">
            Loading...
          </ThemedText>
        </SafeAreaView>
      </View>
    );
  }

  const getGradientColors = (): [string, string] => {
    if (card.color in CardGradients) {
      return CardGradients[card.color as CardGradientKey] as [string, string];
    }
    return [card.color, adjustBrightness(card.color, -20)];
  };

  const barcodeWidth = width - Spacing.md * 4;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={[...getGradientColors(), Colors.charcoal]}
        locations={[0, 0.3, 0.6]}
        style={styles.background}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color={Colors.foreground} />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerButton} onPress={handleEdit}>
              <Ionicons name="pencil" size={20} color={Colors.foreground} />
            </Pressable>
            <Pressable style={styles.headerButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={Colors.destructive} />
            </Pressable>
          </View>
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Card Name */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <ThemedText type="largeTitle" style={styles.cardName}>
              {card.name}
            </ThemedText>
          </Animated.View>

          {/* Large Barcode */}
          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            style={[styles.barcodeCard, Shadows.elevated]}>
            <BarcodeDisplay
              value={card.cardNumber}
              type={card.barcodeType}
              width={barcodeWidth}
              height={card.barcodeType === 'QR' ? barcodeWidth * 0.8 : 140}
              showValue
              backgroundColor={Colors.white}
              lineColor={Colors.charcoal}
            />
          </Animated.View>

          {/* Card Number */}
          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.infoSection}>
            <ThemedText type="subhead" color="muted">
              Card Number
            </ThemedText>
            <ThemedText type="title3" style={styles.cardNumber}>
              {formatCardNumber(card.cardNumber)}
            </ThemedText>
          </Animated.View>

          {/* Notes */}
          {card.notes && (
            <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.infoSection}>
              <ThemedText type="subhead" color="muted">
                Notes
              </ThemedText>
              <ThemedText type="body">{card.notes}</ThemedText>
            </Animated.View>
          )}

          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.actions}>
            <Button
              title="Edit Card"
              variant="secondary"
              onPress={handleEdit}
              leftIcon={<Ionicons name="pencil" size={18} color={Colors.foreground} />}
              fullWidth
            />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function formatCardNumber(number: string): string {
  return number.replace(/(.{4})/g, '$1 ').trim();
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingTop: Spacing.lg,
  },
  cardName: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  barcodeCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  infoSection: {
    marginBottom: Spacing.lg,
  },
  cardNumber: {
    letterSpacing: 2,
    marginTop: Spacing.xxs,
  },
  actions: {
    marginTop: Spacing.md,
  },
});

