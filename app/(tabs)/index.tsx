import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { LoyaltyCard } from '@/components/ui/loyalty-card';
import { BorderRadius, Colors, ComponentSize, Spacing } from '@/constants/theme';
import { useCards } from '@/hooks/use-cards';
import { useLanguage } from '@/hooks/use-language';
import type { LoyaltyCard as LoyaltyCardType } from '@/types/card';

type ViewMode = 'full' | 'grid';
const VIEW_MODE_KEY = '@cardholdr/view_mode';

const VIEW_ICONS: Record<ViewMode, keyof typeof Ionicons.glyphMap> = {
  full: 'grid',
  grid: 'list',
};

const NEXT_VIEW: Record<ViewMode, ViewMode> = {
  full: 'grid',
  grid: 'full',
};

export default function CardsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { cards, isLoading, refreshCards } = useCards();
  const { width: screenWidth } = useWindowDimensions();
  const [viewMode, setViewMode] = useState<ViewMode>('full');

  useEffect(() => {
    AsyncStorage.getItem(VIEW_MODE_KEY).then((stored) => {
      if (stored === 'full' || stored === 'grid') {
        setViewMode(stored);
      }
    });
  }, []);

  // Refresh cards when screen gains focus (e.g., after deleting a card)
  useFocusEffect(
    useCallback(() => {
      refreshCards();
    }, [refreshCards])
  );

  const toggleViewMode = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode((current) => {
      const next = NEXT_VIEW[current];
      AsyncStorage.setItem(VIEW_MODE_KEY, next);
      return next;
    });
  }, []);

  const handleCardPress = useCallback(
    (card: LoyaltyCardType) => {
      router.push(`/card/${card.id}`);
    },
    [router]
  );

  const handleAddCard = useCallback(() => {
    router.push('/add-card');
  }, [router]);

  const gridCardWidth = (screenWidth - Spacing.md * 3) / 2;

  const renderCard = useCallback(
    ({ item, index }: { item: LoyaltyCardType; index: number }) => {
      const isGrid = viewMode === 'grid';

      return (
        <Animated.View
          entering={FadeInDown.delay(index * 50).springify()}
          style={[styles.cardWrapper, isGrid && { width: gridCardWidth }]}>
          <LoyaltyCard
            card={item}
            onPress={() => handleCardPress(item)}
            size={isGrid ? 'small' : 'medium'}
            showBarcode={false}
            style={isGrid ? { width: gridCardWidth, height: gridCardWidth / 1.586 } : undefined}
          />
        </Animated.View>
      );
    },
    [handleCardPress, viewMode, gridCardWidth]
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="wallet-outline" size={64} color={Colors.muted} />
      </View>
      <ThemedText type="title2" style={styles.emptyTitle}>
        {t('cards.emptyTitle')}
      </ThemedText>
      <ThemedText type="body" color="muted" style={styles.emptyDescription}>
        {t('cards.emptyDescription')}
      </ThemedText>
      <Button title={t('cards.addFirstCard')} onPress={handleAddCard} style={styles.emptyButton} />
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
        <View style={styles.headerTop}>
          <ThemedText type="largeTitle">{t('cards.title')}</ThemedText>
          <Pressable onPress={toggleViewMode} style={styles.viewToggle} hitSlop={12}>
            <Ionicons name={VIEW_ICONS[viewMode]} size={24} color={Colors.coral} />
          </Pressable>
        </View>
        <ThemedText type="subhead" color="muted">
          {t(cards.length === 1 ? 'cards.cardCount' : 'cards.cardCount_plural', { count: cards.length })}
        </ThemedText>
      </View>

      {/* Cards List */}
      <FlatList
        key={viewMode}
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={viewMode === 'grid' ? 2 : 1}
        contentContainerStyle={[
          styles.listContent,
          cards.length === 0 && styles.listContentEmpty,
        ]}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewToggle: {
    padding: Spacing.xs,
  },
  gridRow: {
    justifyContent: 'space-between',
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
});
