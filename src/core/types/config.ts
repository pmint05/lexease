export interface ReadingConfig {
  fontSize: number;
  backgroundColor: string;
  textColor: string;
  letterSpacing: number;
  lineHeight: number;
  fontFamily: "OpenDyslexic" | "Lexend";
  highlightColor: string;
  wordsPerHighlight: 1 | 2 | 3;
}