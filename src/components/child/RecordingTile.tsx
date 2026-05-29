import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Text } from "@/src/components/ui/text";
import { Mic, Play } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { Button } from "../shared/Button";

import { Recording } from "@/src/core/types";
import { formatDateTime, formatReadingTime } from "@/src/utils/formatters";

interface RecordingTileProps {
  recording: Recording;
  showTitle?: boolean; // Hiển thị tên sách nếu cần (ví dụ trong trang Lịch sử)
  onPlay: (recording: Recording) => void;
  onDelete: (recordingId: string) => void;
}

export const RecordingTile = ({
  recording,
  showTitle = false,
  onPlay,
  onDelete,
}: RecordingTileProps): React.ReactElement => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Pressable
          onPress={() => onPlay(recording)}
          style={{
            padding: 12,
            backgroundColor: "#F8FAFC",
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#0EA5E9",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mic size={22} color="white" />
          </View>

          <View style={{ flex: 1 }}>
            {showTitle && (
              <Text className="font-bold text-base" numberOfLines={1}>
                {recording.bookTitle}
              </Text>
            )}
            <Text
              className={
                showTitle ? "text-sm text-muted-foreground" : "text-base"
              }
            >
              Bản ghi: {formatDateTime(recording.createdAt)}
            </Text>
            <Text className="text-sm text-muted-foreground">
              Thời lượng: {formatReadingTime(recording.durationMs)}
            </Text>
          </View>

          <Button
            size="sm"
            circular
            uiVariant="ghost"
            icon={<Play size={20} color="#0EA5E9" />}
            onPress={() => onPlay(recording)}
          />
        </Pressable>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onPress={() => onDelete(recording.id)}>
          <Text className="text-destructive">Xóa bản ghi này</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
