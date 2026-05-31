import { RecordingResponse } from "./recording";

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

export interface ProgressSessionResponse {
  sessionId: string;
  storyId: string;
  storyTitle: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  startedAt: string;
  completedAt?: string;
  elapsedMs: number;
  currentWordIndex: number;
  readingSpeedWpm: number;
  recordingCount: number;
  latestEvaluationStatus?: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  latestAccuracy?: number;
}

export interface ProgressSessionDetailResponse {
  session: ProgressSessionResponse;
  recordings: RecordingResponse[];
}

export interface DifficultWordProgressResponse {
  word: string;
  count: number;
}

export interface ProgressBucketResponse {
  date: string;
  practiceMinutes: number;
  sessionsCount: number;
  recordedSessionsCount: number;
  averageReadingSpeedWpm: number;
  averageAccuracy: number;
  averageErrorsPerSession: number;
  ttsHelpCount: number;
}

export interface ProgressSummaryResponse {
  childId: string;
  range: string;
  totalPracticeMinutes: number;
  sessionsCount: number;
  completedSessionsCount: number;
  recordedSessionsCount: number;
  averageReadingSpeedWpm: number;
  averageAccuracy: number;
  averageFluency: number;
  averagePace: number;
  averageErrorsPerSession: number;
  ttsHelpCount: number;
  trend: {
    practiceMinutes: string;
    readingSpeed: string;
    accuracy: string;
    errors: string;
  };
}
