import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input, Text, YStack, InputProps } from "tamagui";

interface FormFieldProps<T extends FieldValues> extends InputProps {
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
    <YStack gap="$1.5" width="100%">
      <Text fontSize="$3" fontWeight="bold" color="$color11" marginLeft="$1">
        {label}
      </Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            size="$4"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
            borderColor={error ? "$red10" : "$color5"}
            focusStyle={{
              borderColor: error ? "$red10" : "$blue10",
              borderWidth: 2,
            }}
            backgroundColor="$background"
            {...inputProps}
          />
        )}
      />

      {description && !error && (
        <Text fontSize="$2" color="$color9" marginLeft="$1">
          {description}
        </Text>
      )}

      {error ? (
        <Text fontSize="$2" color="$red10" marginLeft="$1">
          {error}
        </Text>
      ) : null}
    </YStack>
  );
};
