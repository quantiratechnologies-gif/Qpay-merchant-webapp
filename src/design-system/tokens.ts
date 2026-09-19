/**
 * Quantira Technologies / QtPay Merchant Design Tokens
 * Centralized Type-Safe Design Tokens & Variables
 * Official Unified Green & Signature Dark Palette
 */

export const colors = {
  // Surface & Background Colors (Signature Dark)
  bgPage: '#080C14',
  bgCard: '#111726',
  bgInset: '#151524',
  background: '#080C14',
  surface: '#111726',
  surfaceElevated: '#182236',
  surfaceHover: '#1E293B',
  subSurface: '#151524',
  overlay: 'rgba(0, 0, 0, 0.75)',

  // Borders & Dividers
  border: 'rgba(255, 255, 255, 0.08)',
  borderHairline: 'rgba(255, 255, 255, 0.06)',
  borderStrong: '#2C2C44',
  borderFocus: '#7FE87F',

  // Brand Primary (Unified Green)
  primary: '#7FE87F',
  primaryHover: '#6FD86F',
  primaryDark: '#5FBF5F',
  primaryActive: '#5FBF5F',
  primaryLight: 'rgba(127, 232, 127, 0.14)',
  primaryLightHover: 'rgba(127, 232, 127, 0.22)',
  primaryBorder: 'rgba(127, 232, 127, 0.35)',
  textOnPrimary: '#080C14',

  // Accents
  accentGreen: '#7FE87F',
  accentGreenBright: '#98F598',
  accentGold: '#F59E0B',
  accentGoldBright: '#FCD34D',
  accentBlue: '#38BDF8',
  accentPurple: '#A855F7',
  accentAmber: '#F59E0B',

  // Secondary & Dark Accents
  secondary: '#182236',
  secondaryHover: '#1E293B',
  darkBg: '#080C14',
  darkSurface: '#111726',
  darkSurfaceElevated: '#182236',
  darkBorder: '#2C2C44',
  darkDisabled: '#1E293B',
  darkPlaceholder: '#6E6E85',

  // Neutral Light Surfaces (for contrast/light fallback)
  lightBg: '#FFFFFF',
  lightSurface: '#F8FAFC',
  lightSurfaceElevated: '#FFFFFF',
  lightBorder: '#E2E8F0',

  // Typography
  textPrimary: '#FFFFFF',
  textSecondary: '#A2A2BA',
  textMuted: '#6E6E85',
  textDisabled: '#4B4B60',

  // Semantic Status Colors
  success: '#7FE87F',
  successBright: '#98F598',
  successLight: 'rgba(127, 232, 127, 0.14)',
  successText: '#7FE87F',

  info: '#38BDF8',
  infoLight: 'rgba(56, 189, 248, 0.14)',
  infoText: '#38BDF8',

  purple: '#A855F7',
  purpleLight: 'rgba(168, 85, 247, 0.14)',
  purpleText: '#A855F7',

  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  warningText: '#F59E0B',

  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.12)',
  dangerText: '#FF6B7A',
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
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 16px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  xl: '0 16px 48px rgba(0, 0, 0, 0.6)',
} as const;

export const focus = {
  ring: '2.5px solid #7FE87F',
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
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: radii.md,
    boxShadow: 'none',
  },
  header: {
    backgroundColor: colors.bgPage,
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: 'none',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
    borderRadius: radii.sm,
    fontWeight: typography.weights.bold,
    border: 'none',
    boxShadow: '0 4px 20px rgba(127, 232, 127, 0.35)',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: colors.primary,
    borderRadius: radii.sm,
    fontWeight: typography.weights.semibold,
    border: `1.5px solid ${colors.borderStrong}`,
    boxShadow: 'none',
  },
  input: {
    backgroundColor: colors.bgCard,
    border: `1px solid ${colors.borderStrong}`,
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
