import React from "react";
import { Text, View } from "react-native";

type DataPoint = { x: string; y: number };

type Props = {
  data: DataPoint[];
  color?: string;
};

export default function WeeklyActivityChart({
  data,
  color = "#2E8B57",
}: Props) {
  if (!data.length) {
    return (
      <View style={{ padding: 12, backgroundColor: "#fff", borderRadius: 8 }}>
        <Text style={{ color: "#777", fontSize: 13 }}>
          Chưa có dữ liệu hoạt động tuần này.
        </Text>
      </View>
    );
  }

  const barAreaHeight = 110;
  const max = Math.max(...data.map((d) => d.y), 1);
  const allZero = data.every((d) => d.y === 0);

  if (allZero) {
    return (
      <View style={{ padding: 12, backgroundColor: "#fff", borderRadius: 8 }}>
        <Text style={{ color: "#777", fontSize: 13 }}>
          Tuần này chưa có bài học nào được ghi nhận.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#F1F1F1",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          height: barAreaHeight,
          columnGap: 6,
          overflow: "hidden",
        }}
      >
        {data.map((point, idx) => {
          const barHeight =
            point.y > 0 ? Math.max((point.y / max) * barAreaHeight, 8) : 0;
          return (
            <View
              key={`${point.x}-${idx}`}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <View
                style={{
                  width: "60%",
                  height: barHeight,
                  maxHeight: barAreaHeight,
                  backgroundColor: color,
                  borderRadius: 4,
                }}
              />
            </View>
          );
        })}
      </View>

      <View
        style={{
          marginTop: 8,
          flexDirection: "row",
          columnGap: 6,
        }}
      >
        {data.map((point, idx) => (
          <View
            key={`${point.x}-label-${idx}`}
            style={{ flex: 1, alignItems: "center" }}
          >
            <Text style={{ fontSize: 11, color: "#666" }}>{point.x}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
