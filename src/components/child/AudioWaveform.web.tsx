import { COLORS } from "@/src/core/constants/colors";
import React, { useMemo } from "react";
import { View, useWindowDimensions } from "react-native";

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
  const { width: windowWidth } = useWindowDimensions();

  const canvasWidth = Math.min(windowWidth - 80, 380);

  const primaryColor = COLORS.primary || "#0066CC";
  const mutedColor = COLORS.muted || "#E0E0E0";

  const bars = useMemo(() => {
    if (!meteringData || meteringData.length === 0) return null;

    const sourceData = meteringData.map((db) =>
      Number.isFinite(db) ? db : -160,
    );
    const minDb = Math.min(...sourceData);
    const maxDb = Math.max(...sourceData);
    const range = Math.max(maxDb - minDb, 1);

    const normalizedData = sourceData.map((db) => {
      const relative = (db - minDb) / range;
      const boosted = Math.pow(relative, 0.65);
      return Math.max(0.08, boosted);
    });
    const numberOfBars: number = 60;
    const sampledData: number[] = [];
    const len = normalizedData.length;
    if (len === 0) return null;

    for (let i = 0; i < numberOfBars; i++) {
      const t = numberOfBars === 1 ? 0 : i / (numberOfBars - 1);
      const pos = t * (len - 1);
      const lo = Math.floor(pos);
      const hi = Math.min(len - 1, Math.ceil(pos));
      const frac = pos - lo;
      const vLo = normalizedData[lo] ?? 0.1;
      const vHi = normalizedData[hi] ?? vLo;
      const value = vLo + (vHi - vLo) * frac;
      sampledData.push(value);
    }

    const barWidth = canvasWidth / numberOfBars;
    const gap = 2;
    const actualBarWidth = Math.max(1, barWidth - gap);

    return sampledData.map((value, index) => {
      // apply sqrt to enhance perceptual differences for small amplitudes
      const barHeight = Math.sqrt(value) * height;
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
        alignItems: "flex-end",
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
