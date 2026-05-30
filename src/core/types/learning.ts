export interface LearningSession {
  id: string;
  sessionId?: string;
  childId: string;
  bookId: string;
  bookTitle: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  wordsRead: number;
  speed: number;
}
