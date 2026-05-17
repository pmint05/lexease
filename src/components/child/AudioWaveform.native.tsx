import { Canvas, Group, Rect, RoundedRect } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useTheme } from "tamagui";

interface AudioWaveformProps {
  meteringData: number[];
  progress: number; // 0 to 1 (normalized currentTime / duration)
  height: number;
}

export const AudioWaveform = ({
  meteringData = [],
  progress,
  height,
}: AudioWaveformProps): React.ReactElement => {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  // Calculate width based on screen but cap at modal's maxWidth (450) minus padding
  const canvasWidth = Math.min(windowWidth - 80, 380);

  const primaryColor = theme.primary?.val || "#0066CC";
  const mutedColor = theme.color5?.val || "#E0E0E0";

  // Process metering data to fit the canvas
  const pathData = useMemo(() => {
    // If no data, we will return null and handle it in render
    if (!meteringData || meteringData.length === 0) return null;

    // Normalization logic: convert dB (-160 to 0) to 0-1 range
    const normalizedData = meteringData.map((db) =>
      Math.max(0.1, (db + 160) / 160),
    );

    // Sampling logic: ensure we have exactly N bars across the width
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

    return sampledData.map((val, i) => {
      const barHeight = val * height;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;
      return { x, y, width: actualBarWidth, height: barHeight };
    });
  }, [meteringData, canvasWidth, height]);

  // Fallback if no data (a flat line)
  if (!pathData) {
    return (
      <Canvas style={{ width: canvasWidth, height }}>
        <Rect
          x={0}
          y={height / 2 - 1}
          width={canvasWidth}
          height={2}
          color={mutedColor}
        />
      </Canvas>
    );
  }

  return (
    <Canvas style={{ width: canvasWidth, height }}>
      {/* Background (Unplayed part) */}
      <Group>
        {pathData.map((bar, i) => (
          <RoundedRect
            key={`bg-${i}`}
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            r={bar.width / 2}
            color={mutedColor}
          />
        ))}
      </Group>

      {/* Foreground (Played part) */}
      <Group>
        {pathData.map((bar, i) => {
          const barProgress = (bar.x + bar.width) / canvasWidth;
          if (barProgress > progress) return null;

          return (
            <RoundedRect
              key={`fg-${i}`}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              r={bar.width / 2}
              color={primaryColor}
            />
          );
        })}
      </Group>
    </Canvas>
  );
};
