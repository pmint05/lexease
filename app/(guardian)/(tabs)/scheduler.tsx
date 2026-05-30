import { Button } from "@/src/components/shared/Button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Text } from "@/src/components/ui/text";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

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
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ];

  return (
    <View className="flex-1 bg-background px-4 gap-4">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="gap-4 py-4"
      >
        <View className="gap-4">
          {/* Time Settings */}
          <Card className="p-4">
            <View className="gap-3">
              <Label>
                <Text className="text-lg font-bold">Giờ học ưu tiên</Text>
              </Label>
              <Input
                placeholder="18:00"
                value={schedule.time}
                onChangeText={(text) =>
                  setSchedule({ ...schedule, time: text })
                }
                accessible
                accessibilityLabel="Time input"
              />
            </View>
          </Card>

          {/* Duration */}
          <Card className="p-4">
            <View className="gap-3">
              <Label>
                <Text className="text-lg font-bold">
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
                accessible
                accessibilityLabel="Duration input"
              />
            </View>
          </Card>

          {/* Days Selection */}
          <Card className="p-4">
            <View className="gap-3">
              <Label>
                <Text className="text-lg font-bold">Ngày học trong tuần</Text>
              </Label>
              <View className="gap-2">
                {days.map((day, idx) => {
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
                    <View
                      key={idx}
                      className="flex-row justify-between items-center py-2"
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
                        className={isSelected ? "bg-primary" : "bg-background"}
                        accessibilityRole="switch"
                        accessibilityLabel={`${day} reading scheduled`}
                        accessibilityState={{ checked: Boolean(isSelected) }}
                      >
                        {isSelected ? "Bật" : "Tắt"}
                      </Button>
                    </View>
                  );
                })}
              </View>
            </View>
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
          <Card className="p-4 bg-color2">
            <Text className="text-sm text-muted-foreground">
              Nhắc nhở sẽ được gửi vào khung giờ đã chọn vào các ngày trong
              tuần.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
