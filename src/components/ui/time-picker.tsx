import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { cn } from "@/src/lib/utils";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Clock } from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import { Platform, View, StyleSheet } from "react-native";

type TimePickerProps = {
  value: Date;
  onChange: (d: Date) => void;
  use24Hour?: boolean; // true -> 24h, false -> 12h
  label?: string;
  disabled?: boolean;
  className?: string;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTime(date: Date, use24: boolean) {
  const h = date.getHours();
  const m = date.getMinutes();
  if (use24) return `${pad(h)}:${pad(m)}`;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${pad(m)} ${period}`;
}

export function TimePicker({
  value,
  onChange,
  use24Hour = true,
  label,
  disabled = false,
  className,
}: TimePickerProps): React.ReactElement {
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const display = useMemo(
    () => formatTime(value, use24Hour),
    [value, use24Hour],
  );

  const handleNativeChange = (_event: any, selected?: Date) => {
    if (Platform.OS === "android") setShow(false);
    if (!selected) return;
    onChange(selected);
  };

  const onWebPress = () => {
    if (inputRef.current) {
      // Modern browsers support showPicker()
      if ('showPicker' in inputRef.current) {
        try {
          inputRef.current.showPicker();
        } catch (e) {
          inputRef.current.click();
        }
      } else {
        inputRef.current.click();
      }
    }
  };

  return (
    <View className={cn("w-full", className)}>
      {label ? (
        <Text className="text-sm text-muted-foreground mb-2">{label}</Text>
      ) : null}

      <View className="relative">
        <Button
          variant="outline"
          className="w-full justify-between px-4"
          onPress={Platform.OS === "web" ? onWebPress : () => setShow(true)}
          disabled={disabled}
        >
          <View className="flex-row items-center gap-3">
            <Clock size={16} className="text-muted-foreground" />
            <Text className="text-sm font-medium text-foreground">
              {display}
            </Text>
          </View>
          <Text className="text-sm text-muted-foreground">Chọn</Text>
        </Button>

        {Platform.OS === "web" && (
          <input
            ref={inputRef}
            type="time"
            value={`${pad(value.getHours())}:${pad(value.getMinutes())}`}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value; // HH:MM
              if (!v) return;
              const [hh, mm] = v.split(":");
              const d = new Date(value); // Keep the same date, just change time
              d.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
              onChange(d);
            }}
            step={60}
            style={styles.webInput}
          />
        )}
      </View>

      {Platform.OS !== "web" && show && (
        <DateTimePicker
          testID="timePicker"
          value={value}
          mode="time"
          is24Hour={use24Hour}
          display={Platform.select({ ios: "spinner", android: "default" })}
          onChange={handleNativeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  webInput: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    zIndex: -1, // Hidden but programmatically clickable/triggerable
    pointerEvents: "none",
  },
});

export default TimePicker;
