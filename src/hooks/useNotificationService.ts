import {
  DayOfWeek,
  ProgressSessionResponse,
  ReminderResponse,
  StorySummary,
} from "@/src/core/types";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { useProgressSessionsQuery } from "./useProgressQueries";
import { useRemindersQuery } from "./useReminderQueries";
import { useStoriesQuery } from "./useStoryQueries";

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DAY_MAP: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const getSecondsUntilNext = (
  targetDay: number,
  targetHour: number,
  targetMinute: number,
): number => {
  const now = new Date();
  const next = new Date();
  next.setHours(targetHour, targetMinute, 0, 0);

  const currentDay = now.getDay();
  let daysUntil = targetDay - currentDay;

  if (daysUntil < 0 || (daysUntil === 0 && next <= now)) {
    daysUntil += 7;
  }

  next.setDate(next.getDate() + daysUntil);
  return Math.max(Math.floor((next.getTime() - now.getTime()) / 1000), 0);
};

export const useNotificationService = () => {
  const router = useRouter();

  const requestPermissions = useCallback(async () => {
    if (Platform.OS === "web") return false;

    if (Platform.OS === "android") {
      console.log(
        "[NotificationService] Setting up Android notification channel...",
      );
      await Notifications.setNotificationChannelAsync("lexease-reminders", {
        name: "Nhắc nhở đọc sách",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        showBadge: true,
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  }, []);

  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data;
      if (data?.url) {
        router.push(data.url as any);
      }
    },
    [router],
  );

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse,
    );
    return () => subscription.remove();
  }, [handleNotificationResponse]);

  const { data: stories } = useStoriesQuery({ size: 100 });

  const sendTestNotification = useCallback(async () => {
    if (Platform.OS === "web") return;

    try {
      console.log(
        "[NotificationService] Attempting to schedule test notification...",
      );

      // Pick a random story for the test link
      const availableStories = stories?.items ?? [];
      const randomStory =
        availableStories.length > 0
          ? availableStories[
              Math.floor(Math.random() * availableStories.length)
            ]
          : null;

      const storyId = randomStory?.id ?? "default-id";
      const storyTitle = randomStory?.title ?? "Câu chuyện thú vị";

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test: Giờ đọc sách đến rồi! 📚",
          body: `Cùng khám phá câu chuyện "${storyTitle}" nhé!`,
          data: {
            url: `/(child)/reading/${storyId}`,
            storyId: storyId,
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          android: {
            channelId: "lexease-reminders",
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
          repeats: false,
        },
      });
      console.log(
        "[NotificationService] Test notification scheduled with ID:",
        id,
      );
      // Removed Alert for a smoother demo experience
    } catch (error: any) {
      console.error(
        "[NotificationService] Test notification failed:",
        error.message,
      );
    }
  }, [stories]);

  return { requestPermissions, sendTestNotification };
};

export const useSyncNotifications = (childId: string | null) => {
  const { data: reminders } = useRemindersQuery(childId ?? "");
  const { data: stories } = useStoriesQuery({ size: 100 });
  const { data: sessions } = useProgressSessionsQuery(childId ?? "");

  useEffect(() => {
    if (childId && reminders && stories && sessions) {
      syncRemindersToLocalNotifications(reminders, stories.items, sessions);
    }
  }, [childId, reminders, stories, sessions]);
};

let isSyncing = false;

export const syncRemindersToLocalNotifications = async (
  reminders: ReminderResponse[],
  stories: StorySummary[],
  sessions: ProgressSessionResponse[],
) => {
  if (Platform.OS === "web") return;
  if (isSyncing) return;

  isSyncing = true;
  console.log("[NotificationService] Starting sync...");

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const enabledReminders = reminders.filter((r) => r.enabled);
    if (enabledReminders.length === 0) {
      console.log("[NotificationService] No enabled reminders found.");
      return;
    }

    const completedStoryIds = new Set(
      sessions.filter((s) => s.status === "COMPLETED").map((s) => s.storyId),
    );

    const unreadStories = stories.filter(
      (s) => !completedStoryIds.has(s.id) && !s.isBlockedForCurrentChild,
    );
    const availableStories =
      unreadStories.length > 0
        ? unreadStories
        : stories.filter((s) => !s.isBlockedForCurrentChild);

    if (availableStories.length === 0) {
      console.log(
        "[NotificationService] No available stories for notifications.",
      );
      return;
    }

    let scheduledCount = 0;
    for (const reminder of enabledReminders) {
      const timeParts = (reminder.time || "00:00").split(":");
      const hours = parseInt(timeParts[0], 10) || 0;
      const minutes = parseInt(timeParts[1], 10) || 0;

      for (const day of reminder.daysOfWeek) {
        const weekday = DAY_MAP[day];
        if (weekday === undefined) continue;

        const randomStory =
          availableStories[Math.floor(Math.random() * availableStories.length)];

        try {
          if (Platform.OS === "ios") {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Giờ đọc sách đến rồi! 📚",
                body:
                  reminder.message ||
                  `Cùng khám phá câu chuyện "${randomStory.title}" nhé!`,
                data: {
                  url: `/(child)/reading/${randomStory.id}`,
                  storyId: randomStory.id,
                },
                sound: true,
                android: {
                  channelId: "lexease-reminders",
                },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                hour: hours,
                minute: minutes,
                weekday: weekday,
                repeats: true,
              },
            });
          } else {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Giờ đọc sách đến rồi! 📚",
                body:
                  reminder.message ||
                  `Cùng khám phá câu chuyện "${randomStory.title}" nhé!`,
                data: {
                  url: `/(child)/reading/${randomStory.id}`,
                  storyId: randomStory.id,
                },
                sound: true,
                android: {
                  channelId: "lexease-reminders",
                },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: getSecondsUntilNext(weekday, hours, minutes),
                repeats: false,
              },
            });
          }
          scheduledCount++;
        } catch (innerError: any) {
          console.error(
            `[NotificationService] Failed to schedule for ${day} at ${reminder.time}:`,
            innerError.message,
          );
        }
      }
    }

    console.log(
      `[NotificationService] Successfully scheduled ${scheduledCount} notifications for ${enabledReminders.length} reminders.`,
    );
  } catch (error: any) {
    console.error(
      "[NotificationService] Sync failed:",
      error.message,
      error.code,
    );
  } finally {
    isSyncing = false;
  }
};
