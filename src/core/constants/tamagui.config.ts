import { createAnimations } from "@tamagui/animations-react-native";
import { defaultConfig as configV5 } from "@tamagui/config/v5";
import { createFont, createTamagui } from "tamagui";

// 1. Định nghĩa Font Lexend với đầy đủ các trọng số (weights)
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

// 2. Định nghĩa Font OpenDyslexic (Chuyên dụng cho trẻ em khó đọc)
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
  weight: {
    4: "400",
    7: "700",
  },
  face: {
    400: { normal: "OpenDyslexic-Regular", italic: "OpenDyslexic-Italic" },
    700: { normal: "OpenDyslexic-Bold", italic: "OpenDyslexic-BoldItalic" },
  },
});

// 3. Tạo cấu hình Tamagui
export const tamaguiConfig = createTamagui({
  ...configV5,
  fonts: {
    heading: lexendFont, // Font cho tiêu đề
    body: lexendFont, // Font cho nội dung
    dyslexic: openDyslexicFont, // Font đặc biệt
  },
  tokens: {
    ...configV5.tokens,
    radius: {
      ...configV5.tokens.radius,
      sm: 4,
      md: 8,
      lg: 16,
    },
  },
  themes: {
    light: {
      ...configV5.themes.light,
      background: "#FFFBF7",
      foreground: "#221F1E",
      primary: "#0066CC",
      primaryForeground: "#FFFFFF",
      secondary: "#FFB83D",
      secondaryForeground: "#221F1E",
      accent: "#2E8B57",
      accentForeground: "#FFFFFF",
      destructive: "#E53935",
      destructiveForeground: "#FFFFFF",
      muted: "#F5F0EB",
      mutedForeground: "#5A5A5A",
      border: "#EFEAE6",
      card: "#FFFFFF",
      cardForeground: "#221F1E",
      popover: "#FFFFFF",
      popoverForeground: "#221F1E",
      ring: "#0066CC",
      borderColorFocus: "#0070f3", // Màu xanh bạn muốn hiển thị khi focus
      outlineColorFocus: "transparent", // Ẩn viền đen thô mặc định của trình duyệt web
      borderSizeFocus: 1, // Tăng kích thước viền khi focus để dễ nhận biết hơn
    },
    dark: {
      ...configV5.themes.dark,
      background: "#1A1D1E",
      foreground: "#F5F5F5",
      primary: "#60A5FA",
      primaryForeground: "#1A1D1E",
      secondary: "#FBBF24",
      secondaryForeground: "#1A1D1E",
      accent: "#34D399",
      accentForeground: "#1A1D1E",
      destructive: "#EF4444",
      destructiveForeground: "#F5F5F5",
      muted: "#2D2D2D",
      mutedForeground: "#9BA1A6",
      border: "#2D2D2D",
      card: "#242424",
      cardForeground: "#F5F5F5",
      popover: "#1A1D1E",
      popoverForeground: "#F5F5F5",
      ring: "#60A5FA",
      borderColorFocus: "#38bdf8",
      outlineColorFocus: "transparent",
    },
  },

  animations: createAnimations({
    fast: { damping: 20, mass: 1.2, stiffness: 250 },
    quick: { damping: 20, mass: 1.2, stiffness: 250 }, // <--- Tên "quick" phải tồn tại ở đây
    bouncy: { damping: 10, mass: 0.9, stiffness: 100 },
  }),

  // Định nghĩa các điểm dừng màn hình (Responsive)
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
});

export type AppConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
