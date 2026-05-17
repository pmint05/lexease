import React, { useMemo } from "react";
import { View, useWindowDimensions } from "react-native";
import { useTheme } from "tamagui";

interface AudioWaveformProps {
  meteringData: number[];
  progress: number;
  height: number;
}

export const AudioWaveform = ({
  meteringData = [],
  progress,
  height,
}: AudioWaveformProps): React.ReactElement => {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  const canvasWidth = Math.min(windowWidth - 80, 380);

  const primaryColor = theme.primary?.val || "#0066CC";
  const mutedColor = theme.color5?.val || "#E0E0E0";

  const bars = useMemo(() => {
    if (!meteringData || meteringData.length === 0) return null;

    const normalizedData = meteringData.map((db) =>
      Math.max(0.1, (db + 160) / 160),
    );
    const numberOfBars = 60;
    const sampledData: number[] = [];

    for (let i = 0; i < numberOfBars; i++) {
      const index = Math.min(
        Math.floor(i * (normalizedData.length / numberOfBars)),
        normalizedData.length - 1,
      );
      sampledData.push(normalizedData[index]);
    }

    const barWidth = canvasWidth / numberOfBars;
    const gap = 2;
    const actualBarWidth = Math.max(1, barWidth - gap);

    return sampledData.map((value, index) => {
      const barHeight = value * height;
      const barProgress = (index + 1) / numberOfBars;

      return {
        width: actualBarWidth,
        height: barHeight,
        color: barProgress <= progress ? primaryColor : mutedColor,
      };
    });
  }, [meteringData, canvasWidth, height, mutedColor, primaryColor, progress]);

  if (!bars) {
    return (
      <View
        style={{
          width: canvasWidth,
          height,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: canvasWidth,
            height: 2,
            borderRadius: 999,
            backgroundColor: mutedColor,
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        width: canvasWidth,
        height,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {bars.map((bar, index) => (
        <View
          key={`bar-${index}`}
          style={{
            width: bar.width,
            height: bar.height,
            marginRight: index === bars.length - 1 ? 0 : 2,
            borderRadius: bar.width / 2,
            backgroundColor: bar.color,
          }}
        />
      ))}
    </View>
  );
};
