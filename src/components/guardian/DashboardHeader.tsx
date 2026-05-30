import { Text } from "@/src/components/ui/text";
import React from "react";
import { View } from "react-native";
import ChildSelector from "./ChildSelector";

type Props = {
  onChildChange?: (childId: string | null) => void;
};

export default function DashboardHeader({ onChildChange }: Props) {
  return (
    <View className="gap-4 py-1">
      <Text className="text-2xl font-extrabold tracking-tight">
        Bảng điều khiển
      </Text>
      <ChildSelector onChange={onChildChange} />
    </View>
  );
}
