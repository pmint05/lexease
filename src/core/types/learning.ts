import { ReadingRate } from "./reading";

export interface LearningSession {
  id: string;
  childId: string;
  bookId: string;
  bookTitle: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  wordsRead: number;
  speed: ReadingRate;
}