import React, { useState } from "react";
import {
    Button,
    Card,
    Input,
    Label,
    ScrollView,
    Text,
    XStack,
    YStack,
} from "tamagui";

/**
 * Practice Scheduler Screen
 * Allows guardians to:
 * - Set reading goals
 * - Create practice schedules
 * - Configure reminders
 * - Track adherence
 */
export default function SchedulerScreen(): React.ReactElement {
  const [schedule, setSchedule] = useState({
    monday: true,
    tuesday: true,
    wednesday: false,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
    time: "18:00",
    duration: "30",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
      <Text
        fontSize="$7"
        fontWeight="bold"
        accessibilityRole="header"
        accessibilityLabel="Practice Scheduler"
      >
        📅 Practice Scheduler
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4">
          {/* Time Settings */}
          <Card padding="$4">
            <YStack gap="$3">
              <Label>
                <Text fontSize="$4" fontWeight="bold">
                  Preferred Time
                </Text>
              </Label>
              <Input
                placeholder="18:00"
                value={schedule.time}
                onChangeText={(text) =>
                  setSchedule({ ...schedule, time: text })
                }
                size="$4"
                accessible
                accessibilityLabel="Time input"
              />
            </YStack>
          </Card>

          {/* Duration */}
          <Card padding="$4">
            <YStack gap="$3">
              <Label>
                <Text fontSize="$4" fontWeight="bold">
                  Session Duration (minutes)
                </Text>
              </Label>
              <Input
                placeholder="30"
                value={schedule.duration}
                onChangeText={(text) =>
                  setSchedule({ ...schedule, duration: text })
                }
                keyboardType="number-pad"
                size="$4"
                accessible
                accessibilityLabel="Duration input"
              />
            </YStack>
          </Card>

          {/* Days Selection */}
          <Card padding="$4">
            <YStack gap="$3">
              <Label>
                <Text fontSize="$4" fontWeight="bold">
                  Reading Days
                </Text>
              </Label>
              <YStack gap="$2">
                {days.map((day, idx) => {
                  const key = day.toLowerCase();
                  const isSelected = schedule[key as keyof typeof schedule];

                  return (
                    <XStack
                      key={idx}
                      justifyContent="space-between"
                      alignItems="center"
                      paddingVertical="$2"
                    >
                      <Text>{day}</Text>
                      <Button
                        size="$3"
                        onPress={() =>
                          setSchedule({
                            ...schedule,
                            [key]: !schedule[key as keyof typeof schedule],
                          })
                        }
                        backgroundColor={isSelected ? "$green" : "$gray"}
                        accessible
                        accessibilityRole="switch"
                        accessibilityLabel={`${day} reading scheduled`}
                        accessibilityState={{ checked: Boolean(isSelected) }}
                      >
                        {isSelected ? "✓" : "✕"}
                      </Button>
                    </XStack>
                  );
                })}
              </YStack>
            </YStack>
          </Card>

          {/* Save Button */}
          <Button
            size="$5"
            accessible
            accessibilityRole="button"
            accessibilityLabel="Save schedule settings"
          >
            💾 Save Schedule
          </Button>

          {/* Info */}
          <Card padding="$4" backgroundColor="$blue2">
            <Text fontSize="$3" color="$blue">
              📌 Reminders will be sent at the selected time on chosen days
            </Text>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
