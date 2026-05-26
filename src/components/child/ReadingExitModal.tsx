import { AlertCircle } from "lucide-react-native";
import React from "react";
import { AlertDialog, XStack, YStack } from "tamagui";
import { Button } from "../shared/Button";

interface ReadingExitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const ReadingExitModal = ({
  open,
  onOpenChange,
  onConfirm,
}: ReadingExitModalProps): React.ReactElement => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          key="content"
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          width="90%"
          maxWidth={400}
          borderRadius={32}
        >
          <YStack gap="$4">
            <XStack gap="$3" alignItems="center">
              <AlertCircle size={32} color="orange" />
              <AlertDialog.Title fontWeight="800" fontSize="$6">
                Thoát bài đọc?
              </AlertDialog.Title>
            </XStack>

            <AlertDialog.Description>
              Tiến độ đọc và bản ghi âm của bé sẽ bị mất nếu bé thoát bây giờ.
              Bé có chắc chắn muốn quay lại thư viện không?
            </AlertDialog.Description>

            <XStack
              justifyContent="space-between"
              gap="$3"
              marginTop="$2"
              width={"full"}
            >
              <AlertDialog.Cancel asChild>
                <Button uiVariant="outline" flex={2}>
                  Quay lại đọc tiếp
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button uiVariant="danger" onPress={onConfirm} flex={1}>
                  Thoát ra
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};
