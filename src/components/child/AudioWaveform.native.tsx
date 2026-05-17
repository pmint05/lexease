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

    // Sampling logic: produce N bars across the width using linear interpolation
    const numberOfBars: number = 60;
    const sampledData: number[] = [];
    const len = normalizedData.length;
    if (len === 0) return [];

    for (let i = 0; i < numberOfBars; i++) {
      // Map bar index to position in the source array (0 .. len-1)
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

    return sampledData.map((val, i) => {
      // apply a sqrt transform for better visual dynamics
      const adjusted = Math.sqrt(val);
      const barHeight = adjusted * height;
      const x = i * barWidth;
      // anchor to bottom (so bars grow upwards)
      const y = height - barHeight;
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
