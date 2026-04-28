import { useConfigStore } from "@/src/store/useConfigStore";
import React, { useState } from "react";
import {
    Button,
    Card,
    Label,
    ScrollView,
    Slider,
    Text,
    XStack,
    YStack,
} from "tamagui";

/**
 * Visual Customizer Screen
 * Allows guardians to customize reading experience for dyslexic children:
 * - Font size adjustment
 * - Background color selection
 * - Letter spacing adjustment
 * - Line spacing adjustment
 * - Live preview
 * - Settings persist to device
 */
export default function ConfigScreen(): React.ReactElement {
  const {
    fontSize,
    backgroundColor,
    letterSpacing,
    lineSpacing,
    setFontSize,
    setBackgroundColor,
    setLetterSpacing,
    setLineSpacing,
  } = useConfigStore();
  const [previewText] = useState(
    "The quick brown fox jumps over the lazy dog.",
  );

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };

  const handleLetterSpacingChange = (value: number[]) => {
    setLetterSpacing(value[0]);
  };

  const handleLineSpacingChange = (value: number[]) => {
    setLineSpacing(value[0]);
  };

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
      <Text
        fontSize="$7"
        fontWeight="bold"
        accessibilityRole="header"
        accessibilityLabel="Visual Customizer"
      >
        🎨 Visual Customizer
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4">
          {/* Font Size Control */}
          <Card padding="$4">
            <YStack gap="$3">
              <Label>
                <Text fontSize="$4" fontWeight="bold">
                  Font Size: {fontSize}pt
                </Text>
              </Label>
              <Slider
                min={12}
                max={32}
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                accessible
                accessibilityRole="adjustable"
                accessibilityLabel="Font size slider"
                accessibilityValue={{
                  min: 12,
                  max: 32,
                  now: fontSize,
                  text: `${fontSize} points`,
                }}
              />
            </YStack>
          </Card>

          {/* Letter Spacing Control */}
          <Card padding="$4">
            <YStack gap="$3">
              <Label>
                <Text fontSize="$4" fontWeight="bold">
                  Letter Spacing: {letterSpacing}x
                </Text>
              </Label>
              <Slider
                min={1}
                max={2.5}
                step={0.1}
                value={[letterSpacing]}
                onValueChange={handleLetterSpacingChange}
                accessible
                accessibilityRole="adjustable"
                accessibilityLabel="Letter spacing slider"
                accessibilityValue={{
                  min: 1,
                  max: 2.5,
                  now: letterSpacing,
                  text: `${letterSpacing.toFixed(1)} times normal`,
                }}
              />
            </YStack>
          </Card>

          {/* Line Spacing Control */}
          <Card padding="$4">
            <YStack gap="$3">
              <Label>
                <Text fontSize="$4" fontWeight="bold">
                  Line Spacing: {lineSpacing}x
                </Text>
              </Label>
              <Slider
                min={1}
                max={2}
                step={0.1}
                value={[lineSpacing]}
                onValueChange={handleLineSpacingChange}
                accessible
                accessibilityRole="adjustable"
                accessibilityLabel="Line spacing slider"
                accessibilityValue={{
                  min: 1,
                  max: 2,
                  now: lineSpacing,
                  text: `${lineSpacing.toFixed(1)} times normal`,
                }}
              />
            </YStack>
          </Card>

          {/* Background Color Selection */}
          <Card padding="$4">
            <YStack gap="$3">
              <Label>
                <Text fontSize="$4" fontWeight="bold">
                  Background Color
                </Text>
              </Label>
              <XStack gap="$2" flexWrap="wrap">
                {["#FFF8F0", "#F0F8FF", "#F5F5F5", "#FFFEF5", "#F0F5FF"].map(
                  (color) => (
                    <Button
                      key={color}
                      width={50}
                      height={50}
                      borderRadius="$3"
                      onPress={() => setBackgroundColor(color)}
                      borderWidth={backgroundColor === color ? 3 : 1}
                      borderColor={
                        backgroundColor === color ? "$blue" : "$gray"
                      }
                      backgroundColor={color}
                      accessible
                      accessibilityRole="button"
                      accessibilityLabel={`Select color ${color}`}
                      accessibilityState={{
                        selected: backgroundColor === color,
                      }}
                    />
                  ),
                )}
              </XStack>
            </YStack>
          </Card>

          {/* Live Preview */}
          <Card
            padding="$4"
            backgroundColor={backgroundColor}
            accessible
            accessibilityRole="image"
            accessibilityLabel="Live preview of customized text"
          >
            <YStack gap="$2">
              <Text fontSize="$2" color="$gray">
                Live Preview:
              </Text>
              <Text
                fontSize={`$${Math.round(fontSize / 4)}`}
                lineHeight={fontSize * lineSpacing}
                letterSpacing={fontSize * (letterSpacing - 1)}
              >
                {previewText}
              </Text>
            </YStack>
          </Card>

          {/* Save Button */}
          <Button
            size="$5"
            accessible
            accessibilityRole="button"
            accessibilityLabel="Save customization settings"
          >
            ✓ Settings Saved
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
