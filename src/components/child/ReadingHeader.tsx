import { Text } from "@/src/components/ui/text";
import { ChevronLeft, Settings } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface ReadingHeaderProps {
  title: string;
  progress: number; // 0 to 100
  onBack: () => void;
  onOpenSettings: () => void;
}

export const ReadingHeader = ({
  title,
  progress,
  onBack,
  onOpenSettings,
}: ReadingHeaderProps): React.ReactElement => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="bg-card">
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Button onPress={onBack} size="icon" variant="ghost">
            <ChevronLeft className="text-foreground size-6" />
          </Button>
          <Text
            className="text-lg font-bold"
            numberOfLines={1}
            style={{ flex: 1, textAlign: "left" }}
          >
            {title}
          </Text>
        </View>

        <Button variant="ghost" size={"icon"} onPress={onOpenSettings}>
          <Settings className="text-foreground size-5" />
        </Button>
      </View>
      <Progress value={progress} className="rounded-none" />
    </View>
  );
};
