import { createAnimations } from "@tamagui/animations-react-native";
import { defaultConfig as configV5 } from "@tamagui/config/v5";
import { createFont, createTamagui } from "tamagui";

// 1. Định nghĩa Font Lexend
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
    true: 14,
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

// 2. Định nghĩa Font OpenDyslexic
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
  },
  weight: { 4: "400", 7: "700" },
  face: {
    400: { normal: "OpenDyslexic-Regular", italic: "OpenDyslexic-Italic" },
    700: { normal: "OpenDyslexic-Bold", italic: "OpenDyslexic-BoldItalic" },
  },
});

// 3. Khởi tạo cấu hình Tamagui (Kế thừa và mở rộng chuẩn xác)
export const tamaguiConfig = createTamagui({
  ...configV5,
  tokens: {
    ...configV5.tokens,
    // Sửa lỗi bằng cách merge chính xác object color con bên trong token
    color: {
      brandLightBg: "#FFFBF7",
      brandLightFg: "#221F1E",
      brandDarkBg: "#1A1D1E",
      brandDarkFg: "#F5F5F5",
      brandPrimary: "#0066CC",
      brandPrimaryDark: "#60A5FA",
      brandSecondary: "#FFB83D",
      brandSecondaryDark: "#FBBF24",
      brandAccent: "#2E8B57",
      brandAccentDark: "#34D399",
      brandDestructive: "#E53935",
      brandDestructiveDark: "#EF4444",
      brandMuted: "#F5F0EB",
      brandMutedDark: "#2D2D2D",
      brandBorder: "#EFEAE6",
    },
    // Giữ cấu hình radius tùy chỉnh của bạn mà không lo lỗi đè kiểu dữ liệu
    radius: {
      ...configV5.tokens.radius,
      sm: 4,
      md: 8,
      lg: 16,
    },
  },
  fonts: {
    heading: lexendFont,
    body: lexendFont,
    mono: lexendFont, // Bắt buộc phải bổ sung để tránh lỗi loại trừ hệ thống
    silkscreen: lexendFont, // Bắt buộc phải bổ sung
    lexend: lexendFont,
    dyslexic: openDyslexicFont,
  },
  themes: {
    light: {
      ...configV5.themes.light,
      background: "$brandLightBg",
      color: "$brandLightFg",
      primary: "$brandPrimary",
      secondary: "$brandSecondary",
      accent: "$brandAccent",
      destructive: "$brandDestructive",
      borderColor: "$brandBorder",
      borderColorFocus: "#0070f3",
      shadowColorFocus: "transparent",
    },
    dark: {
      ...configV5.themes.dark,
      background: "$brandDarkBg",
      color: "$brandDarkFg",
      primary: "$brandPrimaryDark",
      secondary: "$brandSecondaryDark",
      accent: "$brandAccentDark",
      destructive: "$brandDestructiveDark",
      borderColor: "$brandMutedDark",
      borderColorFocus: "#38bdf8",
      shadowColorFocus: "transparent",
    },
  },

  animations: createAnimations({
    fast: { damping: 20, mass: 1.2, stiffness: 250 },
    quick: { damping: 20, mass: 1.2, stiffness: 250 },
    bouncy: { damping: 10, mass: 0.9, stiffness: 100 },
  }),

  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  },
  settings: {
    autocompleteSpecificTokens: true,
    disableStandardStyles: false,
    defaultRadius: "md",
    defaultFont: "body",
    defaultTheme: "light",
  },
  shorthands: configV5.shorthands,
});

export type AppConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
