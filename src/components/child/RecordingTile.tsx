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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { Mic, Play } from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { Recording } from "@/src/core/types";
import { formatDateTime, formatReadingTime } from "@/src/utils/formatters";
import { Button } from "../ui/button";

interface RecordingTileProps {
  recording: Recording;
  showTitle?: boolean; // Hiển thị tên sách nếu cần (ví dụ trong trang Lịch sử)
  showRenameAction?: boolean;
  showCreateDate?: boolean;
  onPlay: (recording: Recording) => void;
  onDelete?: (recordingId: string) => void;
  onRename?: (recordingId: string, newTitle: string) => void;
}

export const RecordingTile = ({
  recording,
  showTitle = false,
  showRenameAction = true,
  showCreateDate = false,
  onPlay,
  onDelete,
  onRename,
}: RecordingTileProps): React.ReactElement => {
  const swipeableRef = useRef<any>(null);
  const renameInputRef = useRef<TextInput>(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(recording.bookTitle);

  const canSaveRename = useMemo(() => {
    return (
      draftTitle.trim().length > 0 && draftTitle.trim() !== recording.bookTitle
    );
  }, [draftTitle, recording.bookTitle]);

  const openRenameDialog = () => {
    swipeableRef.current?.close?.();
    setDraftTitle(recording.bookTitle);
    setIsRenameOpen(true);
  };

  const handleSaveRename = () => {
    const nextTitle = draftTitle.trim();
    if (!nextTitle || nextTitle === recording.bookTitle) return;
    onRename?.(recording.id, nextTitle);
    setIsRenameOpen(false);
    swipeableRef.current?.close?.();
  };

  const handleDelete = () => {
    swipeableRef.current?.close?.();
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteConfirmOpen(false);
    onDelete?.(recording.id);
  };

  const renderRightActions = () => {
    return (
      <View className="ml-3 flex-row items-stretch overflow-hidden rounded-2xl">
        {showRenameAction ? (
          <Pressable
            onPress={openRenameDialog}
            className="w-20 items-center justify-center bg-amber-500 px-1"
          >
            <Text className="text-sm font-semibold text-white">Sửa</Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={handleDelete}
          className="w-20 items-center justify-center bg-destructive px-1"
        >
          <Text className="text-sm font-semibold text-white">Xóa</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        containerStyle={{ marginBottom: 0 }}
      >
        <Pressable
          onPress={() => onPlay(recording)}
          className="flex-row items-center gap-4 rounded-lg bg-card p-4"
        >
          <View className="h-11 w-11 items-center justify-center rounded-full bg-sky-500">
            <Mic size={22} color="white" />
          </View>

          <View className="flex-1">
            {showTitle && (
              <Text className="font-bold text-base" numberOfLines={1}>
                {recording.bookTitle}
              </Text>
            )}
            {showCreateDate && (
              <Text
                className={
                  showTitle ? "text-sm text-muted-foreground" : "text-base"
                }
              >
                {formatDateTime(recording.createdAt)}
              </Text>
            )}
            <Text className="text-sm text-muted-foreground">
              {formatReadingTime(recording.durationMs)}
            </Text>
          </View>

          <Button
            variant="ghost"
            className="h-11 w-11 rounded-full"
            onPress={() => onPlay(recording)}
          >
            <Play size={20} color="#0EA5E9" />
          </Button>
        </Pressable>
      </ReanimatedSwipeable>

      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bản ghi?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bạn có chắc muốn xóa bản ghi này
              không?
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
            <AlertDialogAction onPress={confirmDelete} asChild>
              <Button variant="destructive">
                <Text className="text-sm font-semibold text-white">Xóa</Text>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showRenameAction ? (
        <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đổi tên bản ghi</DialogTitle>
              <DialogDescription>
                Cập nhật tên hiển thị cho bản ghi này để dễ tìm lại hơn.
              </DialogDescription>
            </DialogHeader>

            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">
                Tên mới
              </Text>
              <Input
                ref={renameInputRef}
                value={draftTitle}
                onChangeText={setDraftTitle}
                placeholder="Nhập tên mới"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSaveRename}
                className="text-base"
              />
            </View>

            <DialogFooter>
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => setIsRenameOpen(false)}
              >
                <Text className="text-base font-semibold text-foreground">
                  Hủy
                </Text>
              </Button>
              <Button
                variant="default"
                className="flex-1"
                disabled={!canSaveRename}
                onPress={handleSaveRename}
              >
                <Text className="text-base font-semibold primary-foreground">
                  Lưu
                </Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};
