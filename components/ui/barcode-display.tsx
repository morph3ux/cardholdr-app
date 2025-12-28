import { useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import JsBarcode from 'jsbarcode';

import { ThemedText } from '@/components/themed-text';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export type BarcodeType = 'CODE128' | 'QR' | 'EAN13' | 'CODE39' | 'UPC';

export type BarcodeDisplayProps = {
  value: string;
  type: BarcodeType;
  width?: number;
  height?: number;
  showValue?: boolean;
  backgroundColor?: string;
  lineColor?: string;
  style?: ViewStyle;
};

// Custom hook to generate barcode bars
function useBarcodeData(value: string, type: BarcodeType) {
  return useMemo(() => {
    if (type === 'QR') return null;

    try {
      // Create a virtual canvas-like object for JsBarcode
      const bars: { x: number; width: number }[] = [];
      let currentX = 0;

      const barcodeData = {
        encodings: [] as { data: string }[],
      };

      // Map our types to JsBarcode format
      const formatMap: Record<string, string> = {
        CODE128: 'CODE128',
        EAN13: 'EAN13',
        CODE39: 'CODE39',
        UPC: 'UPC',
      };

      JsBarcode(barcodeData, value, {
        format: formatMap[type] || 'CODE128',
        width: 2,
        height: 100,
        displayValue: false,
      });

      // Parse the encodings to get bar positions
      barcodeData.encodings.forEach((encoding) => {
        const data = encoding.data;
        for (let i = 0; i < data.length; i++) {
          if (data[i] === '1') {
            // Find the end of this bar
            let barWidth = 1;
            while (i + barWidth < data.length && data[i + barWidth] === '1') {
              barWidth++;
            }
            bars.push({ x: currentX, width: barWidth });
            i += barWidth - 1;
            currentX += barWidth;
          } else {
            currentX += 1;
          }
        }
      });

      return { bars, totalWidth: currentX };
    } catch (error) {
      console.warn('Barcode generation error:', error);
      return null;
    }
  }, [value, type]);
}

export function BarcodeDisplay({
  value,
  type,
  width = 280,
  height = 100,
  showValue = true,
  backgroundColor = Colors.white,
  lineColor = Colors.charcoal,
  style,
}: BarcodeDisplayProps) {
  const barcodeData = useBarcodeData(value, type);

  if (type === 'QR') {
    return (
      <View style={[styles.container, { backgroundColor }, style]}>
        <QRCode
          value={value || ' '}
          size={Math.min(width, height) - Spacing.md * 2}
          backgroundColor={backgroundColor}
          color={lineColor}
        />
        {showValue && (
          <ThemedText type="caption" style={[styles.valueText, { color: lineColor }]}>
            {value}
          </ThemedText>
        )}
      </View>
    );
  }

  if (!barcodeData || barcodeData.bars.length === 0) {
    return (
      <View style={[styles.container, styles.errorContainer, { backgroundColor }, style]}>
        <ThemedText type="caption" color="muted">
          Invalid barcode
        </ThemedText>
      </View>
    );
  }

  const { bars, totalWidth } = barcodeData;
  const scale = (width - Spacing.md * 2) / totalWidth;
  const barHeight = height - (showValue ? 30 : Spacing.md);

  return (
    <View style={[styles.container, { backgroundColor, width, height }, style]}>
      <Svg width={width - Spacing.md * 2} height={barHeight}>
        {bars.map((bar, index) => (
          <Rect
            key={index}
            x={bar.x * scale}
            y={0}
            width={bar.width * scale}
            height={barHeight}
            fill={lineColor}
          />
        ))}
      </Svg>
      {showValue && (
        <ThemedText type="caption" style={[styles.valueText, { color: lineColor }]}>
          {value}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  errorContainer: {
    minHeight: 80,
  },
  valueText: {
    marginTop: Spacing.xs,
    letterSpacing: 2,
  },
});

