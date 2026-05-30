import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { AlertCircle } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Button } from "../shared/Button";
import { Text } from "../ui/text";

interface ReadingExitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const ReadingExitModal = ({
  open,
  onOpenChange,
  onConfirm,
}: ReadingExitModalProps): React.ReactElement | null => {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <View className="flex gap-4">
          <View className="flex-row items-center gap-3">
            <AlertCircle size={32} color="orange" />
            <DialogTitle>Thoát bài đọc?</DialogTitle>
          </View>

          <DialogDescription>
            Tiến độ đọc và bản ghi âm của bé sẽ bị mất nếu bé thoát bây giờ. Bé
            có chắc chắn muốn quay lại thư viện không?
          </DialogDescription>

          <DialogFooter>
            <Button
              uiVariant="outline"
              onPress={() => onOpenChange(false)}
              className="flex-1 mr-2"
            >
              <Text className="text-base font-semibold text-foreground">
                Quay lại đọc tiếp
              </Text>
            </Button>
            <Button uiVariant="danger" onPress={onConfirm} className="flex-1">
              <Text className="text-base font-semibold text-foreground">
                Thoát ra
              </Text>
            </Button>
          </DialogFooter>
        </View>
      </DialogContent>
    </Dialog>
  );
};
