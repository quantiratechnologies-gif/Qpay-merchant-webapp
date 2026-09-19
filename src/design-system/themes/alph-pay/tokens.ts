/**
 * alph pay — Official Mobile App Design System Tokens
 * Primary: Vibrant Lime Green (#00C853)
 * UI Base: Deep Navy Charcoal (#1A1A2E) & Dark Card Surfaces (#2A2A3E)
 * Secondary: Pure Black (#000000) & Pure White (#FFFFFF)
 * Typography: Inter / SF Pro / Google Sans Flex Scale
 * Border Radius: 8px (Buttons/Inputs), 12px (Cards), 16px (Modals), 24px (Hero)
 * Contrast: High contrast WCAG AA compliant (black text on green CTAs, white text on dark cards)
 */

export const colors = {
  // 1. Primary Color — Regal Gold & Tiers
  primary: '#D4AF37',
  primaryHover: '#E5C453',
  primaryActive: '#B8972E',
  primaryLight: 'rgba(212, 175, 55, 0.15)',
  primaryLightHover: 'rgba(212, 175, 55, 0.25)',
  primaryBorder: 'rgba(212, 175, 55, 0.4)',
  primaryDark: '#8C7320',
  textOnPrimary: '#0B0B0B', // Black text on Gold for maximum luxury readability

  // 2. Secondary Color — Champagne Gold & Grays
  secondary: '#F1D77A',
  secondaryHover: '#E5C453',
  gray25: '#212121',
  gray50: '#525252',
  gray75: '#A3A3A3',
  gray90: '#E5E5E5',

  // 3. Accent Dark — Obsidian UI Surfaces
  darkBg: '#0B0B0B',
  darkSurface: '#171717',
  darkSurfaceElevated: '#212121',
  darkBorder: '#262626',
  darkDisabled: '#333333',
  darkPlaceholder: '#A3A3A3',

  // 4. Neutral — Pure White & Light Surfaces
  lightBg: '#0B0B0B',
  lightSurface: '#171717',
  lightSurfaceElevated: '#212121',
  lightBorder: '#262626',

  // Active App Surfaces (Black + Gold Signature Luxury Experience)
  surface: '#171717',
  surfaceElevated: '#212121',
  background: '#0B0B0B',
  subSurface: '#1E1E1E',
  surfaceHover: '#212121',
  inputFill: '#171717',
  overlay: 'rgba(0, 0, 0, 0.8)',

  // Typography Tiers
  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textMuted: '#737373',
  textDisabled: '#525252',

  // Borders & Dividers
  borderHairline: '#262626',
  borderStrong: '#404040',
  borderFocus: '#D4AF37',

  // Semantic & Feedback Colors
  success: '#22C55E',
  successLight: 'rgba(34, 197, 94, 0.15)',
  successText: '#4ADE80',

  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  warningText: '#FBBF24',

  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.15)',
  dangerText: '#F87171',

  info: '#D4AF37',
  infoLight: 'rgba(212, 175, 55, 0.15)',
  infoText: '#D4AF37',
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
  sm: '8px',   // Buttons, inputs, small chips
  md: '12px',  // Cards, list items
  lg: '16px',  // Balance cards, modals
  xl: '24px',  // Hero banners, large surfaces
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
  ring: '2.5px solid #00C853',
  offset: '2px',
  outline: 'none',
} as const;

export const componentPresets = {
  card: {
    backgroundColor: colors.darkSurface,
    border: `1px solid ${colors.darkBorder}`,
    borderRadius: radii.md,
    boxShadow: shadows.md,
  },
  header: {
    backgroundColor: colors.darkBg,
    borderBottom: `1px solid ${colors.darkBorder}`,
    boxShadow: shadows.none,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
    borderRadius: radii.sm,
    fontWeight: typography.weights.bold,
    border: 'none',
    boxShadow: shadows.none,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: colors.primary,
    borderRadius: radii.sm,
    fontWeight: typography.weights.semibold,
    border: `1.5px solid ${colors.primary}`,
    boxShadow: shadows.none,
  },
  input: {
    backgroundColor: colors.darkBg,
    border: `1px solid ${colors.darkBorder}`,
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

