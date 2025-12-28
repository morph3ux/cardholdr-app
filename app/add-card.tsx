import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useCards } from '@/hooks/use-cards';
import { Colors, CardGradients, Spacing, BorderRadius, type CardGradientKey } from '@/constants/theme';
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
  'blue',
  'purple',
  'green',
  'pink',
  'orange',
  'teal',
  'indigo',
];

export default function AddCardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ cardNumber?: string; barcodeType?: string }>();
  const { addCard } = useCards();

  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState(params.cardNumber || '');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>(
    (params.barcodeType as BarcodeType) || 'CODE128'
  );
  const [color, setColor] = useState<CardGradientKey>('coral');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; cardNumber?: string }>({});

  const validate = useCallback(() => {
    const newErrors: { name?: string; cardNumber?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Store name is required';
    }

    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, cardNumber]);

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
      router.back();
    } catch (error) {
      console.error('Failed to add card:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, cardNumber, barcodeType, color, notes, addCard, router, validate]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Add Card',
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
              title="Save"
              size="small"
              onPress={handleSubmit}
              disabled={isSubmitting}
            />
          ),
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Store Name */}
          <Input
            label="Store Name"
            placeholder="e.g., Starbucks, Target, CVS"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
            autoFocus
          />

          {/* Card Number */}
          <Input
            label="Card Number"
            placeholder="Enter or scan the barcode number"
            value={cardNumber}
            onChangeText={setCardNumber}
            error={errors.cardNumber}
            keyboardType="default"
            autoCapitalize="characters"
            containerStyle={styles.inputSpacing}
          />

          {/* Barcode Type */}
          <View style={styles.inputSpacing}>
            <ThemedText type="subhead" style={styles.label}>
              Barcode Type
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
              Card Color
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
            label="Notes (Optional)"
            placeholder="Any additional info about this card"
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
              Preview
            </ThemedText>
            <Card
              style={[
                styles.previewCard,
                { backgroundColor: CardGradients[color][0] },
              ]}>
              <ThemedText type="title3" style={styles.previewName}>
                {name || 'Store Name'}
              </ThemedText>
              <ThemedText type="caption" style={styles.previewNumber}>
                {cardNumber || '0000 0000 0000'}
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
});

