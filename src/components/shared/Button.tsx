import React from "react";

import {
    Button as BaseButton,
    type ButtonProps as BaseButtonProps,
} from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { cn } from "@/src/lib/utils";
import { View } from "react-native";

/**
 * Shared Button Component for LexEase
 *
 * NOTE: This keeps the existing app-facing API while rendering the Reusables
 * button primitive underneath.
 */
type LegacyVariant =
  | "primary"
  | "default"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "highlight"
  | "ghost"
  | "outline";

type LegacySize = "xsmall" | "small" | "medium" | "large";

type ButtonProps = Omit<BaseButtonProps, "variant" | "size"> & {
  uiVariant?: LegacyVariant;
  // Accept legacy named sizes, Reusables sizes, or arbitrary string tokens (e.g. "$3", "sm", "lg")
  size?: LegacySize | NonNullable<BaseButtonProps["size"]> | string;
  pill?: boolean;
  soft?: boolean;
  circular?: boolean;
  chromeless?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  [key: string]: any;
};

const VARIANT_MAP: Record<
  LegacyVariant,
  NonNullable<BaseButtonProps["variant"]>
> = {
  primary: "default",
  default: "secondary",
  secondary: "outline",
  success: "success",
  danger: "destructive",
  warning: "warning",
  highlight: "highlight",
  ghost: "ghost",
  outline: "outline",
};

const SIZE_MAP: Record<LegacySize, NonNullable<BaseButtonProps["size"]>> = {
  xsmall: "sm",
  small: "sm",
  medium: "default",
  large: "lg",
};

export function Button({
  uiVariant = "primary",
  size = "medium",
  pill,
  soft,
  circular,
  chromeless,
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  const mappedVariant = chromeless ? "ghost" : VARIANT_MAP[uiVariant];
  let mappedSize: any;
  if (circular) mappedSize = "icon";
  else if (typeof size === "string" && (SIZE_MAP as any)[size])
    mappedSize = (SIZE_MAP as any)[size];
  else if (
    typeof size === "string" &&
    (size === "sm" || size === "lg" || size === "default" || size === "icon")
  )
    mappedSize = size;
  else mappedSize = "default";

  return (
    <BaseButton
      variant={mappedVariant}
      size={mappedSize}
      className={cn(
        pill && "rounded-full",
        soft && "border-0",
        circular && "rounded-full",
        className,
      )}
      {...props}
    >
      {icon ? (
        <View className={cn(children ? "mr-2" : undefined)}>{icon}</View>
      ) : null}
      {typeof children === "string" || typeof children === "number" ? (
        <Text>{children}</Text>
      ) : (
        children
      )}
    </BaseButton>
  );
}

export type { ButtonProps };

