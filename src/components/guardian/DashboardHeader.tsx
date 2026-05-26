import React from "react";
import { Text, View } from "react-native";
import ChildSelector from "./ChildSelector";

type Props = {
  onChildChange?: (childId: string | null) => void;
};

export default function DashboardHeader({ onChildChange }: Props) {
  return (
    <View style={{ padding: 4, backgroundColor: "transparent" }}>
      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 8 }}>
        Bảng điều khiển
      </Text>
      <ChildSelector onChange={onChildChange} />
    </View>
  );
}
