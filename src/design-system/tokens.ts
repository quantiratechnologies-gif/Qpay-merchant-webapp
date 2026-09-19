/**
 * Quantira Technologies / QtPay Merchant Design Tokens
 * Centralized Type-Safe Design Tokens & Variables
 */

export const colors = {
  // Surface & Background Colors
  bgPage: '#0B0B0B',
  bgCard: '#171717',
  bgInset: '#1E1E1E',
  background: '#0B0B0B',
  surface: '#171717',
  surfaceElevated: '#212121',
  subSurface: '#1E1E1E',

  // Borders
  border: '#262626',
  borderFocus: '#D4AF37',
  borderHairline: '#262626',
  borderStrong: '#333333',

  // Accents (Luxury Gold)
  accentGreen: '#D4AF37',
  accentGreenBright: '#F1D77A',
  accentGold: '#D4AF37',
  accentGoldBright: '#F1D77A',
  accentBlue: '#38BDF8',
  accentPurple: '#A855F7',
  accentAmber: '#D4AF37',

  // Primary Theme Aliases
  primary: '#D4AF37',
  primaryHover: '#F1D77A',
  primaryActive: '#B8972E',
  primaryLight: 'rgba(212, 175, 55, 0.12)',
  primaryLightHover: 'rgba(212, 175, 55, 0.20)',
  primaryBorder: '#D4AF37',
  primaryDark: '#B8972E',
  textOnPrimary: '#0B0B0B',

  // Secondary & Dark Accents
  secondary: '#000000',
  secondaryHover: '#212121',
  darkBg: '#0B0B0B',
  darkSurface: '#171717',
  darkSurfaceElevated: '#212121',
  darkBorder: '#262626',
  darkDisabled: '#262626',
  darkPlaceholder: '#737373',

  // Neutral Light Surfaces
  lightBg: '#FFFFFF',
  lightSurface: '#F5F5F7',
  lightSurfaceElevated: '#FFFFFF',
  lightBorder: '#E6E6E6',

  // Typography
  textPrimary: '#FFFFFF',
  textSecondary: '#E5E5E5',
  textMuted: '#A3A3A3',
  textDisabled: '#737373',

  // Semantic Status Colors
  success: '#D4AF37',
  successBright: '#F1D77A',
  successLight: 'rgba(212, 175, 55, 0.12)',
  successText: '#D4AF37',

  info: '#38BDF8',
  infoLight: 'rgba(56, 189, 248, 0.12)',
  infoText: '#38BDF8',

  purple: '#A855F7',
  purpleLight: 'rgba(168, 85, 247, 0.12)',
  purpleText: '#A855F7',

  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  warningText: '#F59E0B',

  danger: '#FF4757',
  dangerLight: 'rgba(255, 71, 87, 0.12)',
  dangerText: '#FF6B7A',

  overlay: 'rgba(11, 11, 11, 0.88)',
} as const;

export const spacing = {
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '20px',
  space6: '24px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
} as const;

export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
  none: '0px',
  xs: '4px',
} as const;

export const typography = {
  fontFamily: "'Inter', 'SF Pro Display', 'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  sizes: {
    display: { fontSize: '32px', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.5px' },
    titleLarge: { fontSize: '24px', lineHeight: '32px', fontWeight: 600, letterSpacing: '-0.3px' },
    titleMedium: { fontSize: '20px', lineHeight: '28px', fontWeight: 600, letterSpacing: '0px' },
    titleSmall: { fontSize: '16px', lineHeight: '24px', fontWeight: 500, letterSpacing: '0px' },
    bodyLarge: { fontSize: '16px', lineHeight: '24px', fontWeight: 400, letterSpacing: '0px' },
    bodyRegular: { fontSize: '14px', lineHeight: '20px', fontWeight: 400, letterSpacing: '0px' },
    caption: { fontSize: '12px', lineHeight: '16px', fontWeight: 400, letterSpacing: '0.2px' },
    micro: { fontSize: '10px', lineHeight: '14px', fontWeight: 500, letterSpacing: '0.5px' },
  },
} as const;

export const shadows = {
  none: 'none',
  flat: 'none',
  sm: 'none',
  md: 'none',
  lg: 'none',
  xl: 'none',
} as const;

export const focus = {
  ring: '2.5px solid #D4AF37',
  offset: '2px',
  outline: 'none',
} as const;

export const componentPresets = {
  card: {
    backgroundColor: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    boxShadow: 'none',
  },
  cardInset: {
    backgroundColor: colors.bgInset,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    boxShadow: 'none',
  },
  header: {
    backgroundColor: colors.bgPage,
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: 'none',
  },
  buttonPrimary: {
    backgroundColor: colors.accentGreen,
    color: colors.textOnPrimary,
    borderRadius: radii.sm,
    fontWeight: typography.weights.bold,
    border: 'none',
    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: colors.accentGreenBright,
    borderRadius: radii.sm,
    fontWeight: typography.weights.semibold,
    border: `1.5px solid ${colors.border}`,
    boxShadow: 'none',
  },
  input: {
    backgroundColor: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
    color: colors.textPrimary,
    boxShadow: 'none',
  },
} as const;

export const tokens = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
  focus,
  componentPresets,
} as const;

export const designSystem = tokens;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Radii = typeof radii;
export type Typography = typeof typography;
export type Shadows = typeof shadows;
export type Focus = typeof focus;
export type ComponentPresets = typeof componentPresets;
export type Tokens = typeof tokens;
