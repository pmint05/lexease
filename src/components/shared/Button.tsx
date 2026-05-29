import { GetProps, styled, Button as TamaguiButton } from "tamagui";

/**
 * Shared Button Component for LexEase
 *
 * NOTE: We use 'uiVariant' instead of 'variant' to avoid collision with
 * Tamagui's built-in variant which is restricted to "outlined".
 */
export const Button = styled(TamaguiButton, {
  name: "Button",
  backgroundColor: "$primary",
  borderRadius: "$lg",
  minHeight: 48,
  paddingHorizontal: "$4",

  // Default accessibility
  accessible: true,
  accessibilityRole: "button",

  variants: {
    uiVariant: {
      primary: {
        backgroundColor: "$primary",
        color: "$primaryForeground",
        pressStyle: { backgroundColor: "$primary", opacity: 0.8 },
      },
      default: {
        backgroundColor: "$muted",
        color: "$foreground",
        pressStyle: { backgroundColor: "$muted", opacity: 0.8 },
      },
      secondary: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "$secondary",
        color: "$secondary",
        pressStyle: { backgroundColor: "$secondary", color: "$secondaryForeground", opacity: 0.9 },
      },
      success: {
        backgroundColor: "$accent",
        color: "$accentForeground",
        pressStyle: { backgroundColor: "$accent", opacity: 0.8 },
      },
      danger: {
        backgroundColor: "$destructive",
        color: "$destructiveForeground",
        pressStyle: { backgroundColor: "$destructive", opacity: 0.8 },
      },
      warning: {
        backgroundColor: "$secondary",
        color: "$secondaryForeground",
        pressStyle: { backgroundColor: "$secondary", opacity: 0.8 },
      },
      highlight: {
        backgroundColor: "$secondary",
        color: "$secondaryForeground",
        pressStyle: { backgroundColor: "$secondary", opacity: 0.8 },
      },
      ghost: {
        backgroundColor: "transparent",
        color: "$primary",
        pressStyle: { backgroundColor: "$muted", opacity: 0.8 },
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "$borderColor",
        color: "$foreground",
        pressStyle: { backgroundColor: "$muted", opacity: 0.8 },
      },
    },

    size: {
      xsmall: {
        minHeight: 32,
        height: "fit-content",
        paddingHorizontal: "$2",
        fontSize: "$2",
      },
      small: {
        minHeight: 40,
        paddingHorizontal: "$3",
        fontSize: "$3",
      },
      medium: {
        minHeight: 48,
        paddingHorizontal: "$4",
        fontSize: "$4",
      },
      large: {
        minHeight: 56,
        paddingHorizontal: "$6",
        fontSize: "$5",
      },
    },

    pill: {
      true: {
        borderRadius: 100,
      },
    },

    soft: {
      true: {
        borderWidth: 0,
      },
    },
  } as const,

  defaultVariants: {
    uiVariant: "primary",
    size: "medium",
  },
});

export type ButtonProps = GetProps<typeof Button>;
