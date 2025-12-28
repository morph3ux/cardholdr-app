import { StyleSheet, View, ScrollView, Pressable, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Colors, Spacing, BorderRadius, ComponentSize } from '@/constants/theme';
import { CardService } from '@/services/card-service';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
};

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
  showChevron = true,
}: SettingItemProps) {
  return (
    <Pressable
      style={styles.settingItem}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}>
      <View
        style={[styles.settingIcon, destructive && { backgroundColor: Colors.destructive + '20' }]}>
        <Ionicons
          name={icon}
          size={ComponentSize.iconInline}
          color={destructive ? Colors.destructive : Colors.coral}
        />
      </View>
      <View style={styles.settingContent}>
        <ThemedText
          type="body"
          style={destructive ? { color: Colors.destructive } : undefined}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText type="caption" color="muted">
            {subtitle}
          </ThemedText>
        )}
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={Colors.muted} />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your saved cards. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await CardService.clearAllCards();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Done', 'All data has been reset.');
          },
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://cardholdr.app/privacy');
  };

  const handleTerms = () => {
    Linking.openURL('https://cardholdr.app/terms');
  };

  const handleSupport = () => {
    Linking.openURL('mailto:support@cardholdr.app');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="largeTitle">Settings</ThemedText>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <ThemedText type="subhead" color="muted" style={styles.sectionTitle}>
            GENERAL
          </ThemedText>
          <Card noPadding>
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Coming soon"
              showChevron={false}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="phone-portrait-outline"
              title="Haptic Feedback"
              subtitle="Enabled"
              showChevron={false}
            />
          </Card>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <ThemedText type="subhead" color="muted" style={styles.sectionTitle}>
            DATA
          </ThemedText>
          <Card noPadding>
            <SettingItem
              icon="cloud-upload-outline"
              title="Backup & Sync"
              subtitle="Coming soon"
              showChevron={false}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="download-outline"
              title="Export Cards"
              subtitle="Coming soon"
              showChevron={false}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="trash-outline"
              title="Reset All Data"
              onPress={handleResetData}
              destructive
              showChevron={false}
            />
          </Card>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <ThemedText type="subhead" color="muted" style={styles.sectionTitle}>
            ABOUT
          </ThemedText>
          <Card noPadding>
            <SettingItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={handleTerms}
            />
            <View style={styles.divider} />
            <SettingItem icon="mail-outline" title="Contact Support" onPress={handleSupport} />
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <ThemedText type="caption" color="muted">
            CardHoldr v1.0.0
          </ThemedText>
          <ThemedText type="caption" color="muted">
            Made with ♥ for your privacy
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ComponentSize.tabBarHeight + Spacing.xl,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.coral + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  settingContent: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.md + 36 + Spacing.sm,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xxs,
  },
});

