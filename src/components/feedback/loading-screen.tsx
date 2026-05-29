import { Text } from "@/src/components/ui/text";
import React from "react";
import { View } from "react-native";

const LoadingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center !bg-background">
      <Text>LexEase initializing...</Text>
    </View>
  );
};

export default LoadingScreen;
