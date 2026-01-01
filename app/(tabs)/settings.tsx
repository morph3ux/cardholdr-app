import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { BorderRadius, Colors, ComponentSize, Spacing } from '@/constants/theme';
import { CardService } from '@/services/card-service';
import { useLanguage } from '@/hooks/use-language';
import { SupportedLocale } from '@/i18n';

// Feature flags
const FEATURES = {
  SHOW_NOTIFICATIONS_SETTING: false, // Set to true to enable notifications settings
} as const;

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
  const { t, locale, setLocale, supportedLocales } = useLanguage();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleResetData = () => {
    Alert.alert(
      t('settings.resetTitle'),
      t('settings.resetMessage'),
      [
        { text: t('cardDetail.cancel'), style: 'cancel' },
        {
          text: t('settings.reset'),
          style: 'destructive',
          onPress: async () => {
            await CardService.clearAllCards();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(t('settings.done'), t('settings.resetSuccess'));
          },
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.cardholdr.com/privacy');
  };

  const handleTerms = () => {
    Linking.openURL('https://www.cardholdr.com/terms');
  };

  const handleSupport = () => {
    Linking.openURL('mailto:support@cardholdr.com');
  };

  const handleLanguageSelect = (code: SupportedLocale) => {
    setLocale(code);
    setLanguageModalVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const currentLanguageName = supportedLocales.find((l) => l.code === locale)?.name ?? 'English';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="largeTitle">{t('settings.title')}</ThemedText>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <ThemedText type="subhead" color="muted" style={styles.sectionTitle}>
            {t('settings.general')}
          </ThemedText>
          <Card noPadding>
            <SettingItem
              icon="language-outline"
              title={t('settings.language')}
              subtitle={currentLanguageName}
              onPress={() => setLanguageModalVisible(true)}
            />
            {FEATURES.SHOW_NOTIFICATIONS_SETTING && (
              <>
                <View style={styles.divider} />
                <SettingItem
                  icon="notifications-outline"
                  title={t('settings.notifications')}
                  subtitle={t('settings.comingSoon')}
                  showChevron={false}
                />
              </>
            )}
            <View style={styles.divider} />
            <SettingItem
              icon="phone-portrait-outline"
              title={t('settings.hapticFeedback')}
              subtitle={t('settings.enabled')}
              showChevron={false}
            />
          </Card>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <ThemedText type="subhead" color="muted" style={styles.sectionTitle}>
            {t('settings.data')}
          </ThemedText>
          <Card noPadding>
            <SettingItem
              icon="cloud-upload-outline"
              title={t('settings.backupSync')}
              subtitle={t('settings.comingSoon')}
              showChevron={false}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="download-outline"
              title={t('settings.exportCards')}
              subtitle={t('settings.comingSoon')}
              showChevron={false}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="push-outline"
              title={t('settings.importCards')}
              subtitle={t('settings.comingSoon')}
              showChevron={false}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="trash-outline"
              title={t('settings.resetAllData')}
              onPress={handleResetData}
              destructive
              showChevron={false}
            />
          </Card>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <ThemedText type="subhead" color="muted" style={styles.sectionTitle}>
            {t('settings.about')}
          </ThemedText>
          <Card noPadding>
            <SettingItem
              icon="shield-checkmark-outline"
              title={t('settings.privacyPolicy')}
              onPress={handlePrivacyPolicy}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="document-text-outline"
              title={t('settings.termsOfService')}
              onPress={handleTerms}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="mail-outline"
              title={t('settings.contactSupport')}
              onPress={handleSupport}
            />
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <ThemedText type="caption" color="muted">
            {t('settings.version')}
          </ThemedText>
          <ThemedText type="caption" color="muted">
            {t('settings.madeWith')}
          </ThemedText>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}>
          <View style={styles.modalContent}>
            <ThemedText type="title3" style={styles.modalTitle}>
              {t('settings.language')}
            </ThemedText>
            {supportedLocales.map((lang) => (
              <Pressable
                key={lang.code}
                style={styles.languageOption}
                onPress={() => handleLanguageSelect(lang.code)}>
                <ThemedText type="body">{lang.name}</ThemedText>
                {locale === lang.code && (
                  <Ionicons name="checkmark" size={24} color={Colors.coral} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
});
