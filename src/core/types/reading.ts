export type ReadingRate = 0.5 | 0.75 | 1 | 1.25 | 1.5;

export type BookDifficulty = "easy" | "medium" | "hard";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
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
  speed: ReadingRate;
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
}
