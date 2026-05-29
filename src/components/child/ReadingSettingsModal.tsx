import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { Text } from "@/src/components/ui/text";
import { useReadingStore } from "@/src/store/useReadingStore";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Button } from "../shared/Button";

interface ReadingSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReadingSettingsModal = ({
  open,
  onOpenChange,
}: ReadingSettingsModalProps): React.ReactElement | null => {
  const { speed, setSpeed } = useReadingStore();

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
      <DialogContent>
        <View className="bg-background p-6 rounded-md shadow-md border border-border">
          <View className="gap-1">
            <Text className="text-xl font-black text-foreground">Cài đặt</Text>
            <Text className="text-sm text-muted-foreground">
              Điều chỉnh nhịp độ phù hợp với bé
            </Text>
          </View>

          <View className="gap-4 mt-4">
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
                uiVariant="outline"
                circular
                size="large"
                icon={<Minus size={24} />}
                onPress={handleDecrement}
                disabled={speed <= 0.5}
              />

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
                uiVariant="outline"
                circular
                size="large"
                icon={<Plus size={24} />}
                onPress={handleIncrement}
                disabled={speed >= 2.0}
              />
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
            <Button size="large" onPress={() => onOpenChange(false)}>
              Hoàn tất
            </Button>
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};
