import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Colors, Spacing, BorderRadius, ComponentSize } from '@/constants/theme';

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  // Reset scanned state when screen is focused
  useEffect(() => {
    setScanned(false);
  }, []);

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return;

    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Navigate to add card with scanned data
    router.push({
      pathname: '/add-card',
      params: {
        cardNumber: result.data,
        barcodeType: mapBarcodeType(result.type),
      },
    });
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleManualEntry = () => {
    router.push('/add-card');
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContent}>
          <ThemedText type="body" color="muted">
            Requesting camera permission...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIconContainer}>
            <Ionicons name="camera-outline" size={64} color={Colors.muted} />
          </View>
          <ThemedText type="title2" style={styles.permissionTitle}>
            Camera Access Required
          </ThemedText>
          <ThemedText type="body" color="muted" style={styles.permissionDescription}>
            CardHoldr needs camera access to scan barcodes on your loyalty cards.
          </ThemedText>
          <Button
            title="Allow Camera Access"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
          <Button
            title="Enter Manually Instead"
            variant="ghost"
            onPress={handleManualEntry}
            style={styles.manualButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
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
          <ThemedText type="title2" style={styles.headerTitle}>
            Scan Barcode
          </ThemedText>
          <Pressable style={styles.flashButton} onPress={toggleFlash}>
            <Ionicons
              name={flashOn ? 'flash' : 'flash-outline'}
              size={24}
              color={flashOn ? Colors.coral : Colors.foreground}
            />
          </Pressable>
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
            Align the barcode within the frame
          </ThemedText>
        </View>

        {/* Bottom Actions */}
        <SafeAreaView edges={['bottom']} style={styles.bottomActions}>
          <Button
            title="Enter Manually"
            variant="secondary"
            onPress={handleManualEntry}
            fullWidth
          />
        </SafeAreaView>
      </View>

      {/* Scanned indicator */}
      {scanned && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.scannedOverlay}>
          <View style={styles.scannedContent}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.coral} />
            <ThemedText type="title3" style={styles.scannedText}>
              Barcode Detected!
            </ThemedText>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// Map expo-camera barcode types to our types
function mapBarcodeType(type: string): string {
  const typeMap: Record<string, string> = {
    qr: 'QR',
    ean13: 'EAN13',
    code128: 'CODE128',
    code39: 'CODE39',
    upc_a: 'UPC',
    upc_e: 'UPC',
  };
  return typeMap[type] || 'CODE128';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
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
  manualButton: {
    marginTop: Spacing.sm,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
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
  bottomActions: {
    padding: Spacing.md,
    paddingBottom: ComponentSize.tabBarHeight + Spacing.md,
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
});

