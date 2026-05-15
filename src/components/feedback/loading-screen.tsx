import { Text, YStack } from "tamagui";

const LoadingScreen = () => {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="$background"
    >
      <Text>LexEase initializing...</Text>
    </YStack>
  );
};

export default LoadingScreen;
