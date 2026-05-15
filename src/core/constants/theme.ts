import { Platform } from 'react-native';

/**
 * Dyslexia-friendly color palette (Light Mode)
 * Based on research: cream backgrounds and dark coffee text 
 * provide high contrast with reduced glare.
 */
const tintColorLight = '#0066CC'; // Friendly Blue
const tintColorDark = '#FFF';

export const Colors = {
  light: {
    text: '#221F1E', // var(--foreground)
    background: '#FFFBF7', // var(--background)
    tint: tintColorLight,
    icon: '#5A5A5A',
    tabIconDefault: '#5A5A5A',
    tabIconSelected: tintColorLight,
    primary: tintColorLight,
    secondary: '#FFB83D',
    accent: '#2E8B57',
    border: '#EFEAE6',
  },
  dark: {
    text: '#F5F5F5',
    background: '#1A1D1E',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#60A5FA',
    secondary: '#FBBF24',
    accent: '#34D399',
    border: '#2D2D2D',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Lexend-Regular',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  android: {
    sans: 'Lexend-Regular',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  default: {
    sans: 'Lexend-Regular',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
