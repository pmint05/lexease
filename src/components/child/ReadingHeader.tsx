import { Button } from "@/src/components/shared/Button";
import { Text } from "@/src/components/ui/text";
import { ChevronLeft, Settings } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    <View style={{ paddingTop: insets.top, backgroundColor: "transparent" }}>
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
          <Button
            icon={<ChevronLeft size={24} />}
            uiVariant="ghost"
            chromeless
            onPress={onBack}
            className="p-0 w-10"
          />
          <Text
            className="text-lg font-bold"
            numberOfLines={1}
            style={{ flex: 1, textAlign: "left" }}
          >
            {title}
          </Text>
        </View>

        <Button
          icon={<Settings size={22} />}
          uiVariant="ghost"
          circular
          onPress={onOpenSettings}
        />
      </View>
    </View>
  );
};
