import React from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  color = "#0066CC",
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        margin: 6,
        minWidth: 120,
        elevation: 1,
      }}
    >
      <Text style={{ fontSize: 12, color: "#666" }}>{title}</Text>
      <Text style={{ fontSize: 20, fontWeight: "700", color, marginTop: 6 }}>
        {value}
      </Text>
      {subtitle ? (
        <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
