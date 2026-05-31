import { ConfigFontFamily } from "../constants/fonts";

export interface ReadingConfig {
  fontSize: number;
  backgroundColor: string;
  textColor: string;
  letterSpacing: number;
  lineHeight: number;
  fontFamily: ConfigFontFamily;
  highlightColor: string;
  wordsPerHighlight: 1 | 2 | 3;
}

export interface DisplaySettingsResponse {
  childId: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  backgroundColor: string;
  textColor: string;
  highlightBackgroundColor: string;
  highlightTextColor: string;
  themeName: string | null;
  settingsVersion: number;
}

export interface SaveDisplaySettingsRequest {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  backgroundColor: string;
  textColor: string;
  highlightBackgroundColor: string;
  highlightTextColor: string;
  themeName?: string | null;
}
