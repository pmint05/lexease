import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Text } from "@/src/components/ui/text";
import React from "react";
import { View } from "react-native";
import { BrainCircuit, Activity, Clock } from "lucide-react-native";

interface SkillProgressBarsProps {
  fluency: number;
  pace: number;
  accuracy: number;
}

export default function SkillProgressBars({ fluency, pace, accuracy }: SkillProgressBarsProps) {
  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Kỹ năng cốt lõi</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        <SkillItem 
          label="Trôi chảy" 
          value={fluency} 
          icon={<Activity size={14} className="text-blue-500" />} 
          color="bg-blue-500"
        />
        <SkillItem 
          label="Nhịp độ" 
          value={pace} 
          icon={<Clock size={14} className="text-orange-500" />} 
          color="bg-orange-500"
        />
        <SkillItem 
          label="Chính xác" 
          value={accuracy} 
          icon={<BrainCircuit size={14} className="text-accent" />} 
          color="bg-accent"
        />
      </CardContent>
    </Card>
  );
}

function SkillItem({ 
  label, 
  value, 
  icon, 
  color 
}: { 
  label: string; 
  value: number; 
  icon: React.ReactNode;
  color: string;
}) {
  const percentage = Math.round(value * 100);
  return (
    <View className="gap-1.5">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{label}</Text>
        </View>
        <Text className="text-[10px] font-black text-foreground">{percentage}%</Text>
      </View>
      <Progress value={percentage} className="h-1.5" indicatorClassName={color} />
    </View>
  );
}
