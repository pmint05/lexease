import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Text } from "@/src/components/ui/text";
import { TimePicker } from "@/src/components/ui/time-picker";
import { DayOfWeek } from "@/src/core/types";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import {
  useCreateReminderMutation,
  useDeleteReminderMutation,
  usePatchReminderMutation,
  useRemindersQuery,
} from "@/src/hooks/useReminderQueries";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import {
  AlertCircle,
  Bell,
  Calendar,
  Info,
  Plus,
  Trash2,
} from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

const DAYS_MAP: { key: DayOfWeek; label: string; short: string }[] = [
  { key: "MONDAY", label: "Thứ Hai", short: "T2" },
  { key: "TUESDAY", label: "Thứ Ba", short: "T3" },
  { key: "WEDNESDAY", label: "Thứ Tư", short: "T4" },
  { key: "THURSDAY", label: "Thứ Năm", short: "T5" },
  { key: "FRIDAY", label: "Thứ Sáu", short: "T6" },
  { key: "SATURDAY", label: "Thứ Bảy", short: "T7" },
  { key: "SUNDAY", label: "Chủ Nhật", short: "CN" },
];

/**
 * Practice Scheduler Screen
 * Allows guardians to manage reading reminders for their children.
 */
export default function SchedulerScreen(): React.ReactElement {
  const { user } = useAuthStore();
  const guardianId = user?.id ?? "";

  const selectedChildId = useFamilyStore((state) =>
    guardianId ? state.getSelectedChildId(guardianId) : null,
  );

  const linksQuery = useGuardianChildLinksQuery();
  const acceptedLinks = useMemo(() => {
    return (linksQuery.data ?? []).filter((link) => link.status === "ACCEPTED");
  }, [linksQuery.data]);

  const targetChildId = selectedChildId ?? acceptedLinks[0]?.childId ?? "";
  const selectedChildName = useMemo(() => {
    const link = acceptedLinks.find((l) => l.childId === targetChildId);
    return link?.childEmail?.split("@")[0] || "Bé";
  }, [acceptedLinks, targetChildId]);

  const remindersQuery = useRemindersQuery(targetChildId);
  const createMutation = useCreateReminderMutation(targetChildId);
  const patchMutation = usePatchReminderMutation(targetChildId);
  const deleteMutation = useDeleteReminderMutation(targetChildId);

  const [newReminder, setNewReminder] = useState<{
    time: string;
    daysOfWeek: DayOfWeek[];
    message: string;
  }>({
    time: "19:00",
    daysOfWeek: ["MONDAY", "WEDNESDAY", "FRIDAY"],
    message: "Đã đến giờ luyện đọc rồi bé ơi! 📚",
  });

  const [isAdding, setIsAdding] = useState(false);

  const toggleDay = (day: DayOfWeek) => {
    setNewReminder((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const handleCreate = () => {
    if (!targetChildId) return;
    createMutation.mutate(
      {
        childId: targetChildId,
        time: newReminder.time,
        daysOfWeek: newReminder.daysOfWeek,
        message: newReminder.message,
        timezone:
          Intl.DateTimeFormat().resolvedOptions().timeZone ||
          "Asia/Ho_Chi_Minh",
      },
      {
        onSuccess: () => {
          setIsAdding(false);
          setNewReminder({
            time: "19:00",
            daysOfWeek: ["MONDAY", "WEDNESDAY", "FRIDAY"],
            message: "Đã đến giờ luyện đọc rồi bé ơi! 📚",
          });
        },
      },
    );
  };

  function pad(n: number) {
    return n.toString().padStart(2, "0");
  }

  function timeStringToDate(time: string) {
    const [hStr, mStr] = (time || "00:00").split(":");
    const h = Number(hStr ?? 0);
    const m = Number(mStr ?? 0);
    const d = new Date();
    d.setHours(isNaN(h) ? 0 : h, isNaN(m) ? 0 : m, 0, 0);
    return d;
  }

  function dateToTimeString(d: Date) {
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  if (!targetChildId) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-6">
        <Alert variant="destructive" icon={AlertCircle}>
          <AlertTitle>Chưa có bé liên kết</AlertTitle>
          <AlertDescription>
            Bạn cần liên kết với tài khoản của bé trong phần Cài đặt trước khi
            lập lịch nhắc nhở.
          </AlertDescription>
        </Alert>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row items-center justify-between mb-2 pt-4">
          <View className="flex-row items-center gap-2">
            <Calendar size={24} className="text-primary" />
            <Text className="text-2xl font-bold">Lịch nhắc đọc</Text>
          </View>
          <Button
            size="sm"
            variant={isAdding ? "ghost" : "default"}
            onPress={() => setIsAdding(!isAdding)}
          >
            {isAdding ? (
              <Text>Hủy</Text>
            ) : (
              <>
                <Plus size={18} className="text-primary-foreground mr-1" />
                <Text>Thêm mới</Text>
              </>
            )}
          </Button>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-muted-foreground">
            Đang quản lý lịch cho:{" "}
            <Text className="font-bold text-primary">{selectedChildName}</Text>
          </Text>
        </View>

        <View className="gap-4 pb-10">
          {/* Add New Form */}
          {isAdding && (
            <Card className="!border-primary/20 !bg-primary/5 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Tạo nhắc nhở mới</CardTitle>
                <CardDescription>
                  Chọn thời gian và các ngày trong tuần
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <View className="gap-2">
                  <Label>Giờ nhắc</Label>
                  <View className="flex-1">
                    <TimePicker
                      value={timeStringToDate(newReminder.time)}
                      onChange={(d) =>
                        setNewReminder((p) => ({
                          ...p,
                          time: dateToTimeString(d),
                        }))
                      }
                      use24Hour={true}
                    />
                  </View>
                </View>

                <View className="gap-2">
                  <Label>Ngày trong tuần</Label>
                  <View className="flex-row flex-wrap gap-2">
                    {DAYS_MAP.map((day) => {
                      const selected = newReminder.daysOfWeek.includes(day.key);
                      return (
                        <TouchableOpacity
                          key={day.key}
                          onPress={() => toggleDay(day.key)}
                          className={cn(
                            "px-3 py-2 rounded-lg border",
                            selected
                              ? "bg-primary border-primary"
                              : "bg-background border-border",
                          )}
                        >
                          <Text
                            className={cn(
                              "text-xs font-bold",
                              selected
                                ? "text-primary-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {day.short}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View className="gap-2">
                  <Label>Thông điệp</Label>
                  <Input
                    placeholder="Nhập lời nhắn cho bé..."
                    value={newReminder.message}
                    onChangeText={(t) =>
                      setNewReminder((p) => ({ ...p, message: t }))
                    }
                  />
                </View>

                <Button
                  className="mt-2"
                  onPress={handleCreate}
                  disabled={
                    createMutation.isPending ||
                    !newReminder.time ||
                    newReminder.daysOfWeek.length === 0
                  }
                >
                  {createMutation.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text>Lưu nhắc nhở</Text>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Reminders List */}
          <View className="gap-3">
            <View className="flex-row items-center gap-2 ml-1 mt-2">
              <Bell size={18} className="text-primary" />
              <Text className="font-bold text-lg">Danh sách nhắc nhở</Text>
            </View>

            {remindersQuery.isLoading ? (
              <ActivityIndicator
                className="mt-4"
                size="large"
                color="#FF6B00"
              />
            ) : remindersQuery.data?.length === 0 ? (
              <Card className="items-center py-10 bg-muted/20 border-dashed">
                <Info
                  size={32}
                  className="text-muted-foreground mb-2 opacity-50"
                />
                <Text className="text-muted-foreground italic text-center">
                  Bé chưa có lịch nhắc nào.{"\n"}Nhấn "Thêm mới" để tạo lịch
                  luyện tập!
                </Text>
              </Card>
            ) : (
              remindersQuery.data?.map((reminder) => {
                const ReminderRow = (): React.ReactElement => {
                  const swipeRef = useRef<any>(null);
                  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

                  const renderRightActions = () => (
                    <View className="ml-3 flex-row items-stretch overflow-hidden rounded-2xl">
                      <Pressable
                        onPress={() => {
                          swipeRef.current?.close?.();
                          setIsDeleteOpen(true);
                        }}
                        className="w-20 items-center justify-center bg-destructive px-1"
                      >
                        <Text className="text-sm font-semibold text-white">
                          Xóa
                        </Text>
                      </Pressable>
                    </View>
                  );

                  const handleConfirmDelete = () => {
                    setIsDeleteOpen(false);
                    deleteMutation.mutate(reminder.scheduleId);
                  };

                  return (
                    <>
                      <ReanimatedSwipeable
                        ref={swipeRef}
                        renderRightActions={renderRightActions}
                        overshootRight={false}
                        containerStyle={{ marginBottom: 0 }}
                      >
                        <Card
                          key={reminder.scheduleId}
                          className="border-border py-4"
                        >
                          <CardContent className="px-4">
                            <View className="flex-row justify-between items-start">
                              <View className="flex-1 gap-2">
                                <View className="flex-row items-center gap-2">
                                  <Text className="text-2xl font-black text-foreground">
                                    {reminder.time}
                                  </Text>
                                  <Switch
                                    checked={reminder.enabled}
                                    onCheckedChange={(checked) =>
                                      patchMutation.mutate({
                                        id: reminder.scheduleId,
                                        request: { enabled: checked },
                                      })
                                    }
                                    disabled={patchMutation.isPending}
                                  />
                                </View>

                                <View className="flex-row flex-wrap gap-1">
                                  {DAYS_MAP.map((d) => {
                                    const isActive =
                                      reminder.daysOfWeek.includes(d.key);
                                    return isActive ? (
                                      <Badge
                                        key={d.key}
                                        variant="default"
                                        className="px-1.5 py-0"
                                      >
                                        <Text className="text-[10px] font-bold">
                                          {d.short}
                                        </Text>
                                      </Badge>
                                    ) : null;
                                  })}
                                </View>

                                <Text
                                  className="text-sm text-muted-foreground"
                                  numberOfLines={1}
                                >
                                  "{reminder.message}"
                                </Text>
                              </View>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                onPress={() => {
                                  swipeRef.current?.openRight?.();
                                }}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2
                                  size={18}
                                  className="text-destructive"
                                />
                              </Button>
                            </View>
                          </CardContent>
                        </Card>
                      </ReanimatedSwipeable>

                      <AlertDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa nhắc?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này sẽ xóa nhắc trong danh sách. Bạn có
                              chắc chắn?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                              <Button>
                                <Text className="text-sm font-semibold text-foreground">
                                  Hủy
                                </Text>
                              </Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                variant="destructive"
                                onPress={handleConfirmDelete}
                              >
                                <Text className="text-sm font-semibold text-white">
                                  Xóa
                                </Text>
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  );
                };

                return <ReminderRow key={reminder.scheduleId} />;
              })
            )}
          </View>

          {/* Info Box */}
          <Card className="bg-accent/5 border-accent/20 p-4 flex-row gap-3">
            <Info className="text-primary size-5" />
            <Text className="flex-1 text-xs text-muted-foreground leading-4">
              Nhắc nhở sẽ được gửi trực tiếp đến thiết bị của trẻ vào đúng khung
              giờ bạn đã chọn. Hãy khuyến khích bé luyện tập đều đặn để đạt kết
              quả tốt nhất nhé!
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
