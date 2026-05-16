import React from "react";
import { AlertDialog, Button, XStack, YStack, Text } from "tamagui";
import { AlertCircle } from "lucide-react-native";

interface ReadingExitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const ReadingExitModal = ({
  open,
  onOpenChange,
  onConfirm
}: ReadingExitModalProps): React.ReactElement => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          width="90%"
          maxWidth={400}
        >
          <YStack gap="$4">
            <XStack gap="$3" alignItems="center">
              <AlertCircle size={32} color="$warning" />
              <AlertDialog.Title fontWeight="800" fontSize="$6">
                Thoát bài đọc?
              </AlertDialog.Title>
            </XStack>
            
            <AlertDialog.Description>
              Tiến độ đọc và bản ghi âm của bé sẽ bị mất nếu bé thoát bây giờ. Bé có chắc chắn muốn quay lại thư viện không?
            </AlertDialog.Description>

            <XStack justifyContent="flex-end" gap="$3" marginTop="$2">
              <AlertDialog.Cancel asChild>
                <Button variant="outline" theme="alt1">Quay lại đọc tiếp</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="destructive" onPress={onConfirm}>Thoát ra</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};
