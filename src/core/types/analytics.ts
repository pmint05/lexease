export interface DailyProgress {
  date: string;
  minutesRead: number;
  wordsRead: number;
  sessionsCompleted: number;
  averageAccuracy: number;
}

export interface GuardianAnalytics {
  childId: string;
  totalReadingTimeMinutes: number;
  currentStreakDays: number;
  longestStreakDays: number;
  booksCompleted: number;
  averageComprehension: number;
  weeklyProgress: DailyProgress[];
  monthlyProgress: DailyProgress[];
  readingByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}