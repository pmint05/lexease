import { ReadingRate } from "./reading";

export interface LearningSession {
  id: string;
  bookId: string;
  bookTitle: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  wordsRead: number;
  speed: ReadingRate;
}