/**
 * CardHoldr Theme System
 * Dark-mode only, matching the brand identity
 */

// =============================================================================
// COLORS
// =============================================================================

export const Colors = {
  // Primary accent colors
  coral: '#FF6B4A',
  coralLight: '#FF9A85',
  coralDark: '#E54D2E',

  // Background colors
  charcoal: '#0D1117',
  charcoalLight: '#161B22',
  surface: '#13171E',
  surfaceLight: '#1C2128',

  // Text colors
  foreground: '#F5F5F5',
  muted: '#848D97',

  // Semantic colors
  border: '#262C36',
  destructive: '#DC2626',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Gradient presets for loyalty cards
export const CardGradients = {
  coral: ['#FF6B4A', '#E54D2E'],
  red: ['#EF4444', '#DC2626'],
  blue: ['#3B82F6', '#1D4ED8'],
  purple: ['#8B5CF6', '#6D28D9'],
  green: ['#10B981', '#047857'],
  pink: ['#EC4899', '#BE185D'],
  orange: ['#F97316', '#C2410C'],
  yellow: ['#EAB308', '#CA8A04'],
  teal: ['#14B8A6', '#0D9488'],
  cyan: ['#06B6D4', '#0891B2'],
  indigo: ['#6366F1', '#4338CA'],
  slate: ['#64748B', '#475569'],
} as const;

export type CardGradientKey = keyof typeof CardGradients;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const FontFamily = {
  light: 'Outfit_300Light',
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semiBold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  extraBold: 'Outfit_800ExtraBold',
} as const;

export const FontSize = {
  largeTitle: 28,
  title1: 24,
  title2: 20,
  title3: 18,
  body: 16,
  callout: 15,
  subhead: 14,
  footnote: 13,
  caption: 12,
} as const;

export const LineHeight = {
  largeTitle: 1.2,
  title1: 1.25,
  title2: 1.3,
  title3: 1.35,
  body: 1.5,
  callout: 1.4,
  subhead: 1.4,
  footnote: 1.35,
  caption: 1.3,
} as const;

// =============================================================================
// SPACING (8px base grid)
// =============================================================================

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const Shadows = {
  card: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 4,
  },
  elevated: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 8,
  },
  fab: {
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

// =============================================================================
// ANIMATION TIMING
// =============================================================================

export const Animation = {
  quick: 150,
  standard: 250,
  emphasis: 400,
  pageTransition: 300,
} as const;

// =============================================================================
// COMPONENT SIZES
// =============================================================================

export const ComponentSize = {
  buttonHeight: 48,
  inputHeight: 48,
  touchTarget: 44,
  iconNav: 24,
  iconInline: 20,
  iconSmall: 16,
  tabBarHeight: 80,
} as const;

// =============================================================================
// GLASSMORPHISM
// =============================================================================

export const Glass = {
  background: 'rgba(19, 23, 30, 0.6)',
  border: 'rgba(38, 44, 54, 0.5)',
  blur: 12,
} as const;

// =============================================================================
// THEME OBJECT (for convenience)
// =============================================================================

export const Theme = {
  colors: Colors,
  gradients: CardGradients,
  font: FontFamily,
  fontSize: FontSize,
  lineHeight: LineHeight,
  spacing: Spacing,
  radius: BorderRadius,
  shadows: Shadows,
  animation: Animation,
  size: ComponentSize,
  glass: Glass,
} as const;

export default Theme;
