import { useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { LoyaltyCard } from '@/components/ui/loyalty-card';
import { Button } from '@/components/ui/button';
import { useCards } from '@/hooks/use-cards';
import { Colors, Spacing, ComponentSize, BorderRadius, Shadows } from '@/constants/theme';
import type { LoyaltyCard as LoyaltyCardType } from '@/types/card';

export default function CardsScreen() {
  const router = useRouter();
  const { cards, isLoading, refreshCards } = useCards();

  const handleCardPress = useCallback(
    (card: LoyaltyCardType) => {
      router.push(`/card/${card.id}`);
    },
    [router]
  );

  const handleAddCard = useCallback(() => {
    router.push('/add-card');
  }, [router]);

  const renderCard = useCallback(
    ({ item, index }: { item: LoyaltyCardType; index: number }) => (
      <Animated.View
        entering={FadeInDown.delay(index * 50).springify()}
        style={styles.cardWrapper}>
        <LoyaltyCard card={item} onPress={() => handleCardPress(item)} size="medium" />
      </Animated.View>
    ),
    [handleCardPress]
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="wallet-outline" size={64} color={Colors.muted} />
      </View>
      <ThemedText type="title2" style={styles.emptyTitle}>
        No Cards Yet
      </ThemedText>
      <ThemedText type="body" color="muted" style={styles.emptyDescription}>
        Add your first loyalty card to get started. Scan a barcode or enter details manually.
      </ThemedText>
      <Button title="Add Your First Card" onPress={handleAddCard} style={styles.emptyButton} />
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.coral} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="largeTitle">My Cards</ThemedText>
        <ThemedText type="subhead" color="muted">
          {cards.length} {cards.length === 1 ? 'card' : 'cards'}
        </ThemedText>
      </View>

      {/* Cards List */}
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={[
          styles.listContent,
          cards.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refreshCards}
            tintColor={Colors.coral}
            colors={[Colors.coral]}
          />
        }
      />

      {/* Floating Add Button */}
      {cards.length > 0 && (
        <Pressable style={styles.fab} onPress={handleAddCard}>
          <Ionicons name="add" size={28} color={Colors.charcoal} />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: ComponentSize.tabBarHeight + Spacing.xl,
  },
  listContentEmpty: {
    flex: 1,
  },
  cardWrapper: {
    marginBottom: Spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    minWidth: 200,
  },
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: ComponentSize.tabBarHeight + Spacing.md,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.coral,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.fab,
  },
});
