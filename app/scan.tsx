import { Ionicons } from "@expo/vector-icons";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import {
  BorderRadius,
  Colors,
  ComponentSize,
  Spacing,
} from "@/constants/theme";
import { useLanguage } from "@/hooks/use-language";

// Module-level variable to persist stable permission across component remounts
// This prevents infinite loops from permission oscillations causing remounts
let globalStablePermission: ReturnType<typeof useCameraPermissions>[0] = null;

export default function ScanScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ returnTo?: string; cardId?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  // Initialize stable permission from module-level variable (persists across remounts)
  const [stablePermissionState, setStablePermissionState] = useState<
    typeof permission
  >(globalStablePermission);

  // Stabilize permission state - only update state when permission is not null
  // This prevents infinite loops from intermittent null values
  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/91384ac6-32cf-4c09-a9ee-978da615e911", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "scan.tsx:27",
        message: "Permission state changed",
        data: {
          permission: permission
            ? {
                granted: permission.granted,
                canAskAgain: permission.canAskAgain,
              }
            : null,
          stablePermissionState: stablePermissionState
            ? {
                granted: stablePermissionState.granted,
                canAskAgain: stablePermissionState.canAskAgain,
              }
            : null,
          globalStablePermission: globalStablePermission
            ? {
                granted: globalStablePermission.granted,
                canAskAgain: globalStablePermission.canAskAgain,
              }
            : null,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "post-fix-v4",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    // Only update stable permission state when we have a non-null value
    // Update both local state and module-level variable to persist across remounts
    // This prevents infinite loops from intermittent null returns while allowing real permission updates
    if (permission !== null) {
      if (
        globalStablePermission === null ||
        globalStablePermission.granted !== permission.granted ||
        globalStablePermission.canAskAgain !== permission.canAskAgain
      ) {
        globalStablePermission = permission;
        setStablePermissionState(permission);
      }
    }
  }, [permission]);

  // Use stable permission for rendering decisions - never fall back to null if we have stable value
  const stablePermission = stablePermissionState || permission;

  // Reset scanned state when screen gains focus - but only once on initial mount
  // Removed useFocusEffect to prevent infinite loops from permission oscillations
  const hasResetScannedRef = useRef(false);
  useEffect(() => {
    if (!hasResetScannedRef.current) {
      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/91384ac6-32cf-4c09-a9ee-978da615e911",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "scan.tsx:33",
            message: "Initial mount - resetting scanned",
            data: { scanned },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "post-fix-v3",
            hypothesisId: "C",
          }),
        }
      ).catch(() => {});
      // #endregion
      setScanned(false);
      hasResetScannedRef.current = true;
    }
  }, [scanned]);

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/91384ac6-32cf-4c09-a9ee-978da615e911", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "scan.tsx:31",
        message: "handleBarcodeScanned called",
        data: { scanned, resultData: result.data, params },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "D",
      }),
    }).catch(() => {});
    // #endregion
    if (scanned) return;

    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Navigate back with the scanned data
    // Small delay for visual feedback before navigating
    setTimeout(() => {
      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/91384ac6-32cf-4c09-a9ee-978da615e911",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "scan.tsx:39",
            message: "Navigating after scan",
            data: {
              returnTo: params.returnTo,
              cardId: params.cardId,
              resultData: result.data,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "D",
          }),
        }
      ).catch(() => {});
      // #endregion
      if (params.returnTo === "edit-card" && params.cardId) {
        router.navigate({
          pathname: "/edit-card/[id]",
          params: {
            id: params.cardId,
            cardNumber: result.data,
            barcodeType: mapBarcodeType(result.type),
          },
        });
      } else {
        router.navigate({
          pathname: "/add-card",
          params: {
            cardNumber: result.data,
            barcodeType: mapBarcodeType(result.type),
          },
        });
      }
    }, 300);
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleBack = () => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/91384ac6-32cf-4c09-a9ee-978da615e911", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "scan.tsx:66",
        message: "handleBack called",
        data: { params },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "D",
      }),
    }).catch(() => {});
    // #endregion
    router.back();
  };

  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/91384ac6-32cf-4c09-a9ee-978da615e911", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "scan.tsx:70",
      message: "Render branch check - permission null",
      data: { permissionIsNull: !stablePermission },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "post-fix",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion

  if (!stablePermission) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.centerContent} edges={["top"]}>
          <ThemedText type="body" color="muted">
            {t("scan.requestingPermission")}
          </ThemedText>
        </SafeAreaView>
      </View>
    );
  }

  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/91384ac6-32cf-4c09-a9ee-978da615e911", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "scan.tsx:83",
      message: "Render branch check - permission not granted",
      data: { permissionGranted: stablePermission?.granted },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "post-fix",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion

  if (!stablePermission.granted) {
    const wrappedRequestPermission = () => {
      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/91384ac6-32cf-4c09-a9ee-978da615e911",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "scan.tsx:103",
            message: "requestPermission called",
            data: {
              permissionBefore: stablePermission
                ? {
                    granted: stablePermission.granted,
                    canAskAgain: stablePermission.canAskAgain,
                  }
                : null,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "post-fix",
            hypothesisId: "B",
          }),
        }
      ).catch(() => {});
      // #endregion
      requestPermission();
    };
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.permissionContainer} edges={["top"]}>
          <Pressable style={styles.closeButtonTop} onPress={handleBack}>
            <Ionicons name="close" size={24} color={Colors.foreground} />
          </Pressable>
          <View style={styles.permissionContent}>
            <View style={styles.permissionIconContainer}>
              <Ionicons name="camera-outline" size={64} color={Colors.muted} />
            </View>
            <ThemedText type="title2" style={styles.permissionTitle}>
              {t("scan.permissionTitle")}
            </ThemedText>
            <ThemedText
              type="body"
              color="muted"
              style={styles.permissionDescription}
            >
              {t("scan.permissionDescription")}
            </ThemedText>
            <Button
              title={t("scan.allowCamera")}
              onPress={wrappedRequestPermission}
              style={styles.permissionButton}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/91384ac6-32cf-4c09-a9ee-978da615e911", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "scan.tsx:112",
      message: "Rendering camera view",
      data: { scanned, permissionGranted: stablePermission?.granted },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "post-fix",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CameraView
        style={styles.camera}
        facing="back"
        enableTorch={flashOn}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "ean13",
            "ean8",
            "code128",
            "code39",
            "upc_a",
            "upc_e",
            "codabar",
            "itf14",
            "pdf417",
          ],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <SafeAreaView edges={["top"]} style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="close" size={24} color={Colors.foreground} />
          </Pressable>
          <ThemedText type="title2" style={styles.headerTitle}>
            {t("scan.title")}
          </ThemedText>
          <Pressable style={styles.flashButton} onPress={toggleFlash}>
            <Ionicons
              name={flashOn ? "flash" : "flash-outline"}
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
            {t("scan.scanHint")}
          </ThemedText>
        </View>
      </View>

      {/* Scanned indicator */}
      {scanned && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.scannedOverlay}
        >
          <View style={styles.scannedContent}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.coral} />
            <ThemedText type="title3" style={styles.scannedText}>
              {t("scan.barcodeDetected")}
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
    qr: "QR",
    ean13: "EAN13",
    code128: "CODE128",
    code39: "CODE39",
    upc_a: "UPC",
    upc_e: "UPC",
  };
  return typeMap[type] || "CODE128";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    flex: 1,
  },
  closeButtonTop: {
    position: "absolute",
    top: Spacing.xl + 44, // Safe area + spacing
    left: Spacing.md,
    width: ComponentSize.touchTarget,
    height: ComponentSize.touchTarget,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  permissionIconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  permissionTitle: {
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  permissionDescription: {
    textAlign: "center",
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
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  backButton: {
    width: ComponentSize.touchTarget,
    height: ComponentSize.touchTarget,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: Colors.foreground,
  },
  flashButton: {
    width: ComponentSize.touchTarget,
    height: ComponentSize.touchTarget,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 280,
    height: 180,
    position: "relative",
  },
  corner: {
    position: "absolute",
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
    textAlign: "center",
  },
  scannedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13, 17, 23, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  scannedContent: {
    alignItems: "center",
  },
  scannedText: {
    marginTop: Spacing.md,
    color: Colors.foreground,
  },
});
