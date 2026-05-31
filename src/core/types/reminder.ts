export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface ReminderResponse {
  scheduleId: string;
  childId: string;
  guardianId: string;
  daysOfWeek: DayOfWeek[];
  time: string;
  timezone: string;
  message: string;
  enabled: boolean;
  nextRunAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderRequest {
  childId: string;
  daysOfWeek: DayOfWeek[];
  time: string;
  timezone: string;
  message: string;
}

export interface PatchReminderRequest {
  daysOfWeek?: DayOfWeek[];
  time?: string;
  timezone?: string;
  message?: string;
  enabled?: boolean;
}
