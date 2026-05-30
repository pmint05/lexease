export const FONTS = {
  openDyslexic: "OpenDyslexic-Regular",
  lexend: "Lexend-Regular",
} as const;

/**
 * Maps server fontFamily values to the native font family names loaded by Expo.
 */
export const FONT_MAP = {
  OpenDyslexic: FONTS.openDyslexic,
  Lexend: FONTS.lexend,
  System: FONTS.lexend,
} as const;

export type ConfigFontFamily = keyof typeof FONT_MAP;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

/**
 * Dyslexia-friendly typography settings.
 * Use these as Tailwind classes:
 * - leading-dyslexic (1.625 line height)
 * - tracking-dyslexic (0.05em letter spacing)
 */
export const TYPOGRAPHY = {
  lineHeight: {
    dyslexic: 1.625,
    loose: 2.0,
  },
  letterSpacing: {
    dyslexic: 0.05,
    wide: 0.1,
  },
} as const;
