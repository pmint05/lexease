import { Button } from "@/src/components/shared/Button";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Card, Input, Label, ScrollView, Text, XStack, YStack } from "tamagui";

/**
 * Practice Scheduler Screen
 * Allows guardians to:
 * - Set reading goals
 * - Create practice schedules
 * - Configure reminders
 * - Track adherence
 */
export default function SchedulerScreen(): React.ReactElement {
  const router = useRouter();
  const { logout } = useAuthStore();
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
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ];

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingHorizontal="$4"
      gap="$4"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
      >
        <YStack gap="$4">
          {/* Time Settings */}
          <Card padding="$4">
            <YStack gap="$3">
              <Label>
                <Text fontSize="$4" fontWeight="bold">
                  Giờ học ưu tiên
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
                  Thời lượng phiên (phút)
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
                  Ngày học trong tuần
                </Text>
              </Label>
              <YStack gap="$2">
                {days.map((day, idx) => {
                  const key = day.toLowerCase().replace(" ", ""); // simplified key
                  // Original keys are english, mapping them:
                  const englishDays = [
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ];
                  const engKey = englishDays[idx];
                  const isSelected = schedule[engKey as keyof typeof schedule];

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
                            [engKey]:
                              !schedule[engKey as keyof typeof schedule],
                          })
                        }
                        backgroundColor={
                          isSelected ? "$primary" : "$background"
                        }
                        color={isSelected ? "white" : "$foreground"}
                        borderWidth={1}
                        borderColor="$border"
                        accessible
                        accessibilityRole="switch"
                        accessibilityLabel={`${day} reading scheduled`}
                        accessibilityState={{ checked: Boolean(isSelected) }}
                      >
                        {isSelected ? "Bật" : "Tắt"}
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
            Lưu lịch học
          </Button>

          {/* Info */}
          <Card padding="$4" backgroundColor="$color2">
            <Text fontSize="$3" color="$mutedForeground">
              Nhắc nhở sẽ được gửi vào khung giờ đã chọn vào các ngày trong
              tuần.
            </Text>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
