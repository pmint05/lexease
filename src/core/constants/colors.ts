/**
 * Semantic design tokens for LexEase.
 * These align with the Tailwind/NativeWind configuration in tailwind.config.js
 * and the CSS variables in app/globall.css.
 * 
 * For dyslexia-friendly design:
 * - Backgrounds are off-white/cream to reduce glare.
 * - Contrast is high but not extreme.
 * - Colors are chosen to be clear and distinguishable.
 */

export const TOKENS = {
  colors: {
    background: "background",
    foreground: "foreground",
    primary: "primary",
    secondary: "secondary",
    muted: "muted",
    accent: "accent",
    destructive: "destructive",
    border: "border",
    card: "card",
  },
  typography: {
    fontLexend: "font-lexend",
    fontDyslexic: "font-open-dyslexic",
    lineHeightDyslexic: "leading-dyslexic",
    letterSpacingDyslexic: "tracking-dyslexic",
  },
} as const;

// Legacy COLORS for compatibility, but prefer using Tailwind classes
export const COLORS = {
  cream: "#FFF8F0", // var(--background) light
  textDark: "#2C2C2C", // var(--foreground) light
  primary: "#0066CC", // var(--primary) light
  secondary: "#FFB83D", // var(--secondary) light
  success: "#2E8B57", // var(--accent) light
  error: "#E53935", // var(--destructive) light
  
  // Difficulty levels
  easy: "#A5D6A7",
  medium: "#FFE082",
  hard: "#EF9A9A",
} as const;
