import { createAnimations } from "@tamagui/animations-react-native";
import { defaultConfig as configV5 } from "@tamagui/config/v5";
import { createFont, createTamagui, createTokens } from "tamagui";

// 1. Khởi tạo danh sách màu sắc thô (Raw Colors) cho Tokens
const brandColors = {
  brandLightBg: "#FFFBF7",
  brandLightFg: "#221F1E",
  brandSurface: "#FFFFFF",
  brandDarkBg: "#1A1D1E",
  brandDarkFg: "#F5F5F5",
  brandSurfaceDark: "#242424",
  brandPrimary: "#0066CC",
  brandPrimaryDark: "#60A5FA",
  brandSecondary: "#FFB83D",
  brandSecondaryDark: "#FBBF24",
  brandAccent: "#2E8B57",
  brandAccentDark: "#34D399",
  brandAccentLight: "#E8F5E9",
  brandDestructive: "#E53935",
  brandDestructiveDark: "#EF4444",
  brandMuted: "#F5F0EB",
  brandMutedDark: "#2D2D2D",
  brandBorder: "#EFEAE6",
};

// 2. Khởi tạo Tokens hoàn chỉnh
const tokens = createTokens({
  ...configV5.tokens,
  color: {
    ...configV5.tokens.color,
    ...brandColors,
  },
  radius: {
    ...configV5.tokens.radius,
    sm: 4,
    md: 8,
    lg: 16,
  },
});

// 3. Định nghĩa Font Lexend (Đã sửa lỗi scale font size của v5)
const lexendFont = createFont({
  family: "Lexend-Regular",
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 24,
    9: 32,
    10: 44,
    // Bổ sung ánh xạ chuỗi để triệt tiêu lỗi "No font size found..." từ các component v5 mặc định
    true: 14,
    small: 12,
    medium: 14,
    large: 18,
  },
  lineHeight: {
    1: 15,
    2: 17,
    3: 19,
    4: 21,
    5: 23,
    6: 25,
    7: 27,
    8: 31,
    9: 40,
    10: 52,
    true: 21,
    small: 17,
    medium: 21,
    large: 25,
  },
  weight: {
    1: "100",
    2: "200",
    3: "300",
    4: "400",
    5: "500",
    6: "600",
    7: "700",
    8: "800",
    9: "900",
  },
  face: {
    100: { normal: "Lexend-Thin" },
    200: { normal: "Lexend-ExtraLight" },
    300: { normal: "Lexend-Light" },
    400: { normal: "Lexend-Regular" },
    500: { normal: "Lexend-Medium" },
    600: { normal: "Lexend-SemiBold" },
    700: { normal: "Lexend-Bold" },
    800: { normal: "Lexend-ExtraBold" },
    900: { normal: "Lexend-Black" },
  },
});

// 4. Định nghĩa Font OpenDyslexic
const openDyslexicFont = createFont({
  family: "OpenDyslexic-Regular",
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 24,
    9: 32,
    10: 44,
    true: 14,
    small: 12,
    medium: 14,
    large: 18,
  },
  lineHeight: {
    1: 15,
    2: 17,
    3: 19,
    4: 21,
    5: 23,
    6: 25,
    7: 27,
    8: 31,
    9: 40,
    10: 52,
    true: 21,
    small: 17,
    medium: 21,
    large: 25,
  },
  weight: { 4: "400", 7: "700" },
  face: {
    400: { normal: "OpenDyslexic-Regular", italic: "OpenDyslexic-Italic" },
    700: { normal: "OpenDyslexic-Bold", italic: "OpenDyslexic-BoldItalic" },
  },
});

// 5. Khởi tạo cấu hình Tamagui
export const tamaguiConfig = createTamagui({
  ...configV5,
  tokens, // Nạp toàn bộ hệ thống tokens mới đã cấu trúc lại
  fonts: {
    heading: lexendFont,
    body: lexendFont,
    mono: lexendFont,
    silkscreen: lexendFont,
    lexend: lexendFont,
    dyslexic: openDyslexicFont,
  },
  themes: {
    light: {
      ...configV5.themes.light,
      background: "$brandLightBg",
      backgroundStrong: "$brandSurface",
      color: "$brandLightFg",
      foreground: "$brandLightFg",
      surface: "$brandSurface",
      card: "$brandSurface",
      primary: "$brandPrimary",
      primaryForeground: "white",
      secondary: "$brandSecondary",
      secondaryForeground: "$brandLightFg",
      accent: "$brandAccent",
      accentForeground: "white",
      destructive: "$brandDestructive",
      destructiveForeground: "white",
      muted: "$brandMuted",
      mutedForeground: "#5A5A5A",
      borderColor: "$brandBorder",
    },
    dark: {
      ...configV5.themes.dark,
      background: "$brandDarkBg",
      backgroundStrong: "$brandSurfaceDark",
      color: "$brandDarkFg",
      foreground: "$brandDarkFg",
      surface: "$brandSurfaceDark",
      card: "$brandSurfaceDark",
      primary: "$brandPrimaryDark",
      primaryForeground: "$brandDarkBg",
      secondary: "$brandSecondaryDark",
      secondaryForeground: "$brandDarkBg",
      accent: "$brandAccentDark",
      accentForeground: "$brandDarkBg",
      destructive: "$brandDestructiveDark",
      destructiveForeground: "white",
      muted: "$brandMutedDark",
      mutedForeground: "#2D2D2D",
      borderColor: "$brandMutedDark",
    },
  },

  animations: createAnimations({
    fast: { damping: 20, mass: 1.2, stiffness: 250 },
    quick: { damping: 20, mass: 1.2, stiffness: 250 },
    bouncy: { damping: 10, mass: 0.9, stiffness: 100 },
  }),

  media: configV5.media,
  shorthands: configV5.shorthands,

  settings: {
    autocompleteSpecificTokens: true,
    disableStandardStyles: false,
    defaultRadius: "md",
    defaultFont: "body",
    defaultTheme: "light",
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
