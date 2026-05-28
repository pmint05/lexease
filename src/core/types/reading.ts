export type BookDifficulty = "easy" | "medium" | "hard";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  category: string;
  difficulty: BookDifficulty;
  wordCount: number;
  estimatedMinutes: number;
  content: string;
  words: string[];
  wordTimestamps?: number[];
}

export interface ReadingSession {
  id: string;
  bookId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  wordsRead: number;
  accuracy?: number;
  speed: number;
  recordingPath?: string;
  comprehensionScore?: number;
}

export interface Recording {
  id: string;
  sessionId: string;
  childId: string;
  bookId: string;
  bookTitle: string;
  filePath: string;
  durationMs: number;
  createdAt: string;
  sizeBytes: number;
  meteringData?: number[]; // Biên độ âm thanh theo thời gian
}

export type ReadingSessionStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
export type ReadingEventType =
  | "START"
  | "PAUSE"
  | "RESUME"
  | "WORD_SHOWN"
  | "TTS_HELP"
  | "COMPLETE";

export interface WordTiming {
  wordIndex: number;
  text: string;
  startMs: number;
  endMs: number;
  startChar: number | null;
  endChar: number | null;
}

export interface ReadingTts {
  status: "PENDING" | "PROCESSING" | "READY" | "FAILED" | "INVALIDATED";
  assetId: string | null;
  voice: string;
  audioUrl: string | null;
  wordTimings: WordTiming[];
}

export interface ReadingStory {
  id: string;
  title: string;
  content: string;
}

export interface BackendReadingSession {
  sessionId: string;
  status: ReadingSessionStatus;
  story: ReadingStory;
  tts: ReadingTts;
  resumePosition: {
    wordIndex: number;
  };
  elapsedMs: number;
}

export interface StartReadingSessionRequest {
  storyId: string;
  voice?: string;
  mode?: "RESUME_OR_START" | "START_FROM_BEGINNING";
}

export interface ReadingProgressEvent {
  type: ReadingEventType;
  word?: string;
  wordIndex?: number;
  timestampMs?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateReadingProgressRequest {
  currentWordIndex: number;
  elapsedMs: number;
  events?: ReadingProgressEvent[];
}
