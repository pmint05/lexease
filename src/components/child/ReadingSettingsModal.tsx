import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Switch } from "@/src/components/ui/switch";
import { Text } from "@/src/components/ui/text";
import { useReadingStore } from "@/src/store/useReadingStore";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Button } from "../ui/button";

interface ReadingSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReadingSettingsModal = ({
  open,
  onOpenChange,
}: ReadingSettingsModalProps): React.ReactElement | null => {
  const { speed, setSpeed, isAutoScrollEnabled, setIsAutoScrollEnabled } =
    useReadingStore();

  if (!open) return null;

  const handleIncrement = () => {
    if (speed < 2.0) {
      setSpeed(Math.round((speed + 0.1) * 10) / 10);
    }
  };

  const handleDecrement = () => {
    if (speed > 0.5) {
      setSpeed(Math.round((speed - 0.1) * 10) / 10);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[300px] max-w-md w-full">
        <DialogTitle>
          <View className="gap-1">
            <Text className="text-xl font-black text-foreground">Cài đặt</Text>
            <Text className="text-sm text-muted-foreground">
              Điều chỉnh nhịp độ phù hợp với bé
            </Text>
          </View>
        </DialogTitle>
        <View className="w-full">
          <View className="gap-4">
            <Text className="font-bold uppercase">Tốc độ Spotlight</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
              }}
            >
              <Button
                variant="outline"
                size="lg"
                onPress={handleDecrement}
                disabled={speed <= 0.5}
              >
                <Minus className="text-foreground size-5" />
              </Button>

              <View style={{ alignItems: "center", width: 100 }}>
                <Text className="text-2xl font-black text-primary">
                  {speed.toFixed(1)}x
                </Text>
                <View style={{ flexDirection: "row", gap: 4, marginTop: 4 }}>
                  <Text className="text-xs font-bold text-muted-foreground">
                    {speed <= 0.8 ? "Chậm" : speed >= 1.5 ? "Nhanh" : "Vừa"}
                  </Text>
                </View>
              </View>

              <Button
                variant="outline"
                size="lg"
                onPress={handleIncrement}
                disabled={speed >= 2.0}
              >
                <Plus className="text-foreground size-5" />
              </Button>
            </View>
          </View>

          <View className="flex-row items-center justify-between rounded-2xl border border-border bg-muted/20 px-4 py-3 mt-4">
            <View className="flex-1 pr-3">
              <Text className="font-bold uppercase">Tự động cuộn</Text>
              <Text className="text-xs text-muted-foreground mt-1">
                Giữ từ đang đọc ở giữa màn hình.
              </Text>
            </View>
            <Switch
              checked={isAutoScrollEnabled}
              onCheckedChange={setIsAutoScrollEnabled}
            />
          </View>
        </View>
        <DialogFooter>
          <Button
            size="lg"
            onPress={() => onOpenChange(false)}
            className="mt-6 w-full"
            style={{ width: "100%" }}
          >
            <Text className="text-base font-semibold text-white">Hoàn tất</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
