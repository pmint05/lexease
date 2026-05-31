import { cn } from "@/src/lib/utils";
import * as SliderPrimitive from "@rn-primitives/slider";
import * as React from "react";
import { Platform } from "react-native";

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex h-5 w-full items-center",
        Platform.select({ web: "select-none touch-none" }),
        className,
      )}
      {...props}
    />
  );
}

function SliderTrack({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Track>) {
  return (
    <SliderPrimitive.Track
      className={cn(
        "bg-muted relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function SliderRange({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Range>) {
  return (
    <SliderPrimitive.Range
      className={cn("bg-primary absolute h-full", className)}
      {...props}
    />
  );
}

function SliderThumb({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Thumb>) {
  return (
    <SliderPrimitive.Thumb
      className={cn(
        "border-primary bg-background h-4 w-4 rounded-full border shadow-sm shadow-black/10 -mt-1",
        className,
      )}
      {...props}
    />
  );
}

export { Slider, SliderRange, SliderThumb, SliderTrack };

