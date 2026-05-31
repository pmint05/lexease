import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { View } from "react-native";

import { Input } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";

interface FormFieldProps<T extends FieldValues> extends Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChangeText" | "onBlur"
> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  description?: string;
}

/**
 * FormField Component
 * Standardized input with label and error message
 * Integrated with react-hook-form
 */
export const FormField = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  description,
  secureTextEntry,
  ...inputProps
}: FormFieldProps<T>) => {
  return (
    <View className="w-full gap-1.5">
      <Text className="ml-1 text-sm font-bold text-foreground">{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
            className={error ? "border-destructive" : undefined}
            {...inputProps}
          />
        )}
      />

      {description && !error && (
        <Text className="ml-1 text-xs text-muted-foreground">
          {description}
        </Text>
      )}

      {error ? (
        <Text className="ml-1 text-xs text-destructive">{error}</Text>
      ) : null}
    </View>
  );
};
