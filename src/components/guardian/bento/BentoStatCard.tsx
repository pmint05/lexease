import { Card, CardContent } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { cn } from "@/src/lib/utils";
import React from "react";
import { View } from "react-native";

interface BentoStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    type: "up" | "down" | "neutral";
  };
  className?: string;
}

export default function BentoStatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: BentoStatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/50 py-0", className)}>
      <CardContent className="p-4 flex-col justify-between h-full">
        <View className="flex-row justify-between items-start mb-2">
          <View className="p-2 rounded-lg bg-primary/10">{icon}</View>
          {trend && (
            <View
              className={cn(
                "px-2 py-0.5 rounded-full flex-row items-center",
                trend.type === "up"
                  ? "bg-accent/10"
                  : trend.type === "down"
                    ? "bg-destructive/10"
                    : "bg-muted",
              )}
            >
              <Text
                className={cn(
                  "text-[10px] font-bold",
                  trend.type === "up"
                    ? "text-accent"
                    : trend.type === "down"
                      ? "text-destructive"
                      : "text-muted-foreground",
                )}
              >
                {trend.type === "up" ? "↑" : trend.type === "down" ? "↓" : "•"}{" "}
                {trend.value}
              </Text>
            </View>
          )}
        </View>
        <View>
          <Text className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            {title}
          </Text>
          <Text className="text-xl font-black text-foreground mt-0.5">
            {value}
          </Text>
          {subtitle && (
            <Text className="text-[10px] text-muted-foreground mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      </CardContent>
    </Card>
  );
}
