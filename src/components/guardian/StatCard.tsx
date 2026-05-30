import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import React from "react";
import { View } from "react-native";

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
  const { theme } = useEffectiveTheme();

  return (
    <Card className="min-w-[140px] flex-1 p-0">
      <CardHeader className="px-4 pt-4 pb-0">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <Text
          className="text-2xl font-bold"
          style={{ color: color || theme.primary }}
        >
          {value}
        </Text>
      </CardContent>
      {subtitle ? (
        <View className="px-4 pb-4">
          <CardDescription>{subtitle}</CardDescription>
        </View>
      ) : null}
    </Card>
  );
}
