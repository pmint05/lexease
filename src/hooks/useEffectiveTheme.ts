import { THEME } from "@/src/lib/theme";
import { useThemeStore } from "@/src/store/useThemeStore";
import { Platform, useColorScheme } from "react-native";

type ThemeName = "light" | "dark";

export function useEffectiveTheme() {
  const colorScheme = useColorScheme();
  const preferredTheme = useThemeStore((state) => state.theme);

  const systemPreference =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : colorScheme;

  const effectiveColorScheme: ThemeName =
    preferredTheme === "system"
      ? (systemPreference ?? "light")
      : preferredTheme;

  return {
    colorScheme,
    effectiveColorScheme,
    theme: effectiveColorScheme === "dark" ? THEME.dark : THEME.light,
  };
}
