import { ReadingConfig } from "@/src/core/types";

export const MOCK_SERVER_CONFIG: ReadingConfig = {
  fontSize: 24,
  backgroundColor: "#E0F7FA", // Light Cyan
  textColor: "#004D40", // Dark Teal
  letterSpacing: 1.5,
  lineHeight: 1.8,
  fontFamily: "Lexend",
  highlightColor: "#000000", // Amber
  wordsPerHighlight: 1,
};

export const MOCK_GUARDIAN_PRESETS: Record<string, ReadingConfig> = {
  "night-reading": {
    fontSize: 22,
    backgroundColor: "#121212",
    textColor: "#E0E0E0",
    letterSpacing: 1.3,
    lineHeight: 1.6,
    fontFamily: "Lexend",
    highlightColor: "#BB86FC",
    wordsPerHighlight: 1,
  },
  "high-contrast": {
    fontSize: 28,
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    letterSpacing: 2.0,
    lineHeight: 2.0,
    fontFamily: "OpenDyslexic",
    highlightColor: "#FFFF00",
    wordsPerHighlight: 1,
  },
};
