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