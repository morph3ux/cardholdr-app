import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useCards } from '@/hooks/use-cards';
import { useLanguage } from '@/hooks/use-language';
import {
  Colors,
  CardGradients,
  Spacing,
  BorderRadius,
  ComponentSize,
  type CardGradientKey,
} from '@/constants/theme';
import type { BarcodeType } from '@/types/card';

const BARCODE_TYPES: { value: BarcodeType; label: string }[] = [
  { value: 'CODE128', label: 'Code 128' },
  { value: 'QR', label: 'QR Code' },
  { value: 'EAN13', label: 'EAN-13' },
  { value: 'CODE39', label: 'Code 39' },
  { value: 'UPC', label: 'UPC' },
];

const COLOR_OPTIONS: CardGradientKey[] = [
  'coral',
  'red',
  'blue',
  'purple',
  'green',
  'pink',
  'orange',
  'yellow',
  'teal',
  'cyan',
  'indigo',
  'slate',
];

// Map expo-camera barcode types to our types
function mapBarcodeType(type: string): BarcodeType {
  const typeMap: Record<string, BarcodeType> = {
    qr: 'QR',
    ean13: 'EAN13',
    code128: 'CODE128',
    code39: 'CODE39',
    upc_a: 'UPC',
    upc_e: 'UPC',
  };
  return typeMap[type] || 'CODE128';
}

export default function AddCardScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ cardNumber?: string; barcodeType?: string }>();
  const { addCard } = useCards();

  // Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Form state
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState(params.cardNumber || '');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>(
    (params.barcodeType as BarcodeType) || 'CODE128'
  );
  const [color, setColor] = useState<CardGradientKey>('coral');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; cardNumber?: string }>({});

  // Update state when params change
  useEffect(() => {
    if (params.cardNumber) {
      setCardNumber(params.cardNumber);
    }
    if (params.barcodeType) {
      setBarcodeType(params.barcodeType as BarcodeType);
    }
  }, [params.cardNumber, params.barcodeType]);

  // Reset scanned state when scanner is opened
  useEffect(() => {
    if (showScanner) {
      setScanned(false);
    }
  }, [showScanner]);

  const validate = useCallback(() => {
    const newErrors: { name?: string; cardNumber?: string } = {};

    if (!name.trim()) {
      newErrors.name = t('cardForm.storeNameRequired');
    }

    if (!cardNumber.trim()) {
      newErrors.cardNumber = t('cardForm.cardNumberRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, cardNumber, t]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsSubmitting(true);
    try {
      await addCard({
        name: name.trim(),
        cardNumber: cardNumber.trim(),
        barcodeType,
        color,
        notes: notes.trim() || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (navigation.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Failed to add card:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, cardNumber, barcodeType, color, notes, addCard, router, navigation, validate]);

  const handleClose = useCallback(() => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [router, navigation]);

  const handleScan = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowScanner(true);
  }, []);

  const handleBarcodeScanned = useCallback((result: BarcodeScanningResult) => {
    if (scanned) return;

    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Populate form fields with scanned data
    setCardNumber(result.data);
    setBarcodeType(mapBarcodeType(result.type));

    // Close scanner after a brief delay for visual feedback
    setTimeout(() => {
      setShowScanner(false);
      setScanned(false);
    }, 300);
  }, [scanned]);

  const handleCloseScanner = useCallback(() => {
    setShowScanner(false);
    setScanned(false);
  }, []);

  const toggleFlash = useCallback(() => {
    setFlashOn((prev) => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // Stabilize Stack.Screen options to prevent remounts
  const screenOptions = useMemo(
    () => ({
      title: t('cardForm.addTitle'),
      headerStyle: { backgroundColor: Colors.charcoal },
      headerTintColor: Colors.coral,
      headerTitleStyle: { fontFamily: 'Outfit_600SemiBold' },
      headerLeft: () => (
        <Pressable onPress={handleClose} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={Colors.foreground} />
        </Pressable>
      ),
      headerRight: () => (
        <Button
          title={t('cardForm.save')}
          size="small"
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      ),
    }),
    [t, handleClose, handleSubmit, isSubmitting]
  );

  // Render form view with conditional scanner overlay
  return (
    <View style={styles.container}>
      <Stack.Screen options={screenOptions} />

      {/* Scanner Modal - rendered when showScanner is true */}
      <Modal
        visible={showScanner}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseScanner}>
        <View style={styles.container}>
          {!permission ? (
            <View style={styles.scannerFullScreen}>
              <SafeAreaView style={styles.centerContent} edges={['top']}>
                <ThemedText type="body" color="muted">
                  {t('scan.requestingPermission')}
                </ThemedText>
              </SafeAreaView>
            </View>
          ) : !permission.granted ? (
            <View style={styles.scannerFullScreen}>
              <SafeAreaView style={styles.permissionContainer} edges={['top']}>
                <Pressable style={styles.closeButtonTop} onPress={handleCloseScanner}>
                  <Ionicons name="close" size={24} color={Colors.foreground} />
                </Pressable>
                <View style={styles.permissionContent}>
                  <View style={styles.permissionIconContainer}>
                    <Ionicons name="camera-outline" size={64} color={Colors.muted} />
                  </View>
                  <ThemedText type="title2" style={styles.permissionTitle}>
                    {t('scan.permissionTitle')}
                  </ThemedText>
                  <ThemedText
                    type="body"
                    color="muted"
                    style={styles.permissionDescription}>
                    {t('scan.permissionDescription')}
                  </ThemedText>
                  <Button
                    title={t('scan.allowCamera')}
                    onPress={requestPermission}
                    style={styles.permissionButton}
                  />
                </View>
              </SafeAreaView>
            </View>
          ) : (
            <>
              <CameraView
                style={styles.camera}
                facing="back"
                enableTorch={flashOn}
                barcodeScannerSettings={{
                  barcodeTypes: [
                    'qr',
                    'ean13',
                    'ean8',
                    'code128',
                    'code39',
                    'upc_a',
                    'upc_e',
                    'codabar',
                    'itf14',
                    'pdf417',
                  ],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              />

              {/* Overlay */}
              <View style={styles.overlay}>
                {/* Header */}
                <SafeAreaView edges={['top']} style={styles.header}>
                  <View style={styles.headerContent}>
                    <Pressable style={styles.backButton} onPress={handleCloseScanner}>
                      <Ionicons name="close" size={24} color={Colors.foreground} />
                    </Pressable>
                    <ThemedText type="title2" style={styles.headerTitle}>
                      {t('scan.title')}
                    </ThemedText>
                    <Pressable style={styles.flashButton} onPress={toggleFlash}>
                      <Ionicons
                        name={flashOn ? 'flash' : 'flash-outline'}
                        size={24}
                        color={flashOn ? Colors.coral : Colors.foreground}
                      />
                    </Pressable>
                  </View>
                </SafeAreaView>

                {/* Scan Area */}
                <View style={styles.scanAreaContainer}>
                  <View style={styles.scanArea}>
                    {/* Corner brackets */}
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                  </View>
                  <ThemedText type="callout" color="muted" style={styles.scanHint}>
                    {t('scan.scanHint')}
                  </ThemedText>
                </View>
              </View>

              {/* Scanned indicator */}
              {scanned && (
                <Animated.View
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={styles.scannedOverlay}>
                  <View style={styles.scannedContent}>
                    <Ionicons name="checkmark-circle" size={64} color={Colors.coral} />
                    <ThemedText type="title3" style={styles.scannedText}>
                      {t('scan.barcodeDetected')}
                    </ThemedText>
                  </View>
                </Animated.View>
              )}
            </>
          )}
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          pointerEvents={showScanner ? 'none' : 'auto'}>
          {/* Store Name */}
          <Input
            label={t('cardForm.storeName')}
            placeholder={t('cardForm.storeNamePlaceholder')}
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
            autoFocus
          />

          {/* Card Number */}
          <Input
            label={t('cardForm.cardNumber')}
            placeholder={t('cardForm.cardNumberPlaceholder')}
            value={cardNumber}
            onChangeText={setCardNumber}
            error={errors.cardNumber}
            keyboardType="default"
            autoCapitalize="characters"
            containerStyle={styles.inputSpacing}
            rightIcon={
              <Pressable onPress={handleScan} hitSlop={8}>
                <Ionicons name="scan" size={22} color={Colors.coral} />
              </Pressable>
            }
          />

          {/* Barcode Type */}
          <View style={styles.inputSpacing}>
            <ThemedText type="subhead" style={styles.label}>
              {t('cardForm.barcodeType')}
            </ThemedText>
            <View style={styles.barcodeTypes}>
              {BARCODE_TYPES.map((type) => (
                <Pressable
                  key={type.value}
                  style={[
                    styles.barcodeTypeButton,
                    barcodeType === type.value && styles.barcodeTypeButtonActive,
                  ]}
                  onPress={() => {
                    setBarcodeType(type.value);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}>
                  <ThemedText
                    type="caption"
                    style={[
                      styles.barcodeTypeText,
                      barcodeType === type.value && styles.barcodeTypeTextActive,
                    ]}>
                    {type.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Color */}
          <View style={styles.inputSpacing}>
            <ThemedText type="subhead" style={styles.label}>
              {t('cardForm.cardColor')}
            </ThemedText>
            <View style={styles.colorPicker}>
              {COLOR_OPTIONS.map((colorKey) => (
                <Pressable
                  key={colorKey}
                  style={[
                    styles.colorOption,
                    { backgroundColor: CardGradients[colorKey][0] },
                    color === colorKey && styles.colorOptionActive,
                  ]}
                  onPress={() => {
                    setColor(colorKey);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}>
                  {color === colorKey && (
                    <Ionicons name="checkmark" size={20} color={Colors.white} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Notes */}
          <Input
            label={t('cardForm.notes')}
            placeholder={t('cardForm.notesPlaceholder')}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            containerStyle={styles.inputSpacing}
            style={styles.notesInput}
          />

          {/* Preview */}
          <View style={styles.previewSection}>
            <ThemedText type="subhead" style={styles.label}>
              {t('cardForm.preview')}
            </ThemedText>
            <Card
              style={[
                styles.previewCard,
                { backgroundColor: CardGradients[color][0] },
              ]}>
              <ThemedText type="title3" style={styles.previewName}>
                {name || t('cardForm.defaultStoreName')}
              </ThemedText>
              <ThemedText type="caption" style={styles.previewNumber}>
                {cardNumber || t('cardForm.defaultCardNumber')}
              </ThemedText>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
  },
  headerButton: {
    padding: Spacing.xs,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  inputSpacing: {
    marginTop: Spacing.md,
  },
  label: {
    color: Colors.foreground,
    marginBottom: Spacing.xs,
  },
  barcodeTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  barcodeTypeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  barcodeTypeButtonActive: {
    backgroundColor: Colors.coral + '20',
    borderColor: Colors.coral,
  },
  barcodeTypeText: {
    color: Colors.muted,
  },
  barcodeTypeTextActive: {
    color: Colors.coral,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionActive: {
    borderWidth: 3,
    borderColor: Colors.white,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  previewSection: {
    marginTop: Spacing.lg,
  },
  previewCard: {
    padding: Spacing.md,
    aspectRatio: 1.586,
    justifyContent: 'space-between',
  },
  previewName: {
    color: Colors.white,
  },
  previewNumber: {
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
  },
  // Scanner styles
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
  },
  closeButtonTop: {
    position: 'absolute',
    top: Spacing.xl + 44,
    left: Spacing.md,
    width: ComponentSize.touchTarget,
    height: ComponentSize.touchTarget,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  permissionIconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  permissionTitle: {
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  permissionDescription: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  permissionButton: {
    minWidth: 200,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: Spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    width: ComponentSize.touchTarget,
    height: ComponentSize.touchTarget,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.foreground,
  },
  flashButton: {
    width: ComponentSize.touchTarget,
    height: ComponentSize.touchTarget,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 280,
    height: 180,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.coral,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: BorderRadius.md,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: BorderRadius.md,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: BorderRadius.md,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: BorderRadius.md,
  },
  scanHint: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  scannedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 17, 23, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedContent: {
    alignItems: 'center',
  },
  scannedText: {
    marginTop: Spacing.md,
    color: Colors.foreground,
  },
  scannerFullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.charcoal,
    zIndex: 1000,
  },
});
