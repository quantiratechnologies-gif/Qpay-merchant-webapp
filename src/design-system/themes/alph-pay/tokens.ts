/**
 * alph pay — Official Mobile App Design System Tokens
 * Primary: Unified Emerald Green (#7FE87F)
 * UI Base: Signature Dark (#080C14) & Deep Card Surfaces (#111726 / #182236)
 * Secondary: #A2A2BA / #6E6E85 & Pure White (#FFFFFF)
 * Typography: Inter / SF Pro / Google Sans Flex Scale
 * Border Radius: 8px (Buttons/Inputs), 12px (Cards), 16px (Modals), 20px (Hero)
 * Contrast: High contrast WCAG AA compliant (dark text #080C14 on green CTAs, white text on dark cards)
 */

export const colors = {
  // 1. Primary Color — Unified Green & Tiers
  primary: '#7FE87F',
  primaryHover: '#6FD86F',
  primaryActive: '#5FBF5F',
  primaryLight: 'rgba(127, 232, 127, 0.14)',
  primaryLightHover: 'rgba(127, 232, 127, 0.22)',
  primaryBorder: 'rgba(127, 232, 127, 0.35)',
  primaryDark: '#5FBF5F',
  textOnPrimary: '#080C14', // Dark text on green for maximum readability

  // 2. Secondary Color
  secondary: '#182236',
  secondaryHover: '#1E293B',
  gray25: '#111726',
  gray50: '#182236',
  gray75: '#6E6E85',
  gray90: '#A2A2BA',

  // 3. Accent Dark — Signature Dark Surfaces
  darkBg: '#080C14',
  darkSurface: '#111726',
  darkSurfaceElevated: '#182236',
  darkBorder: '#2C2C44',
  darkDisabled: '#1E293B',
  darkPlaceholder: '#6E6E85',

  // 4. Neutral — Pure White & Light Surfaces
  lightBg: '#080C14',
  lightSurface: '#111726',
  lightSurfaceElevated: '#182236',
  lightBorder: '#2C2C44',

  // Active App Surfaces
  surface: '#111726',
  surfaceElevated: '#182236',
  background: '#080C14',
  subSurface: '#151524',
  surfaceHover: '#1E293B',
  inputFill: '#111726',
  overlay: 'rgba(0, 0, 0, 0.75)',

  // Typography Tiers
  textPrimary: '#FFFFFF',
  textSecondary: '#A2A2BA',
  textMuted: '#6E6E85',
  textDisabled: '#4B4B60',

  // Borders & Dividers
  borderHairline: 'rgba(255, 255, 255, 0.06)',
  borderStrong: '#2C2C44',
  borderFocus: '#7FE87F',

  // Semantic & Feedback Colors
  success: '#7FE87F',
  successLight: 'rgba(127, 232, 127, 0.14)',
  successText: '#7FE87F',

  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  warningText: '#F59E0B',

  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.12)',
  dangerText: '#FF6B7A',

  info: '#38BDF8',
  infoLight: 'rgba(56, 189, 248, 0.14)',
  infoText: '#38BDF8',
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

export const radii = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '999px',
} as const;

export const shadows = {
  none: 'none',
  flat: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 12px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  xl: '0 16px 48px rgba(0, 0, 0, 0.6)',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

export const focus = {
  ring: '2.5px solid #7FE87F',
  offset: '2px',
  outline: 'none',
} as const;

export const componentPresets = {
  card: {
    backgroundColor: colors.darkSurface,
    border: `1px solid ${colors.borderHairline}`,
    borderRadius: radii.md,
    boxShadow: shadows.md,
  },
  header: {
    backgroundColor: colors.darkBg,
    borderBottom: `1px solid ${colors.borderHairline}`,
    boxShadow: shadows.none,
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
    boxShadow: shadows.none,
  },
  input: {
    backgroundColor: colors.darkSurface,
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: radii.sm,
    color: colors.textPrimary,
    boxShadow: shadows.none,
  },
} as const;

export const designSystem = {
  colors,
  typography,
  radii,
  shadows,
  spacing,
  focus,
  componentPresets,
};
