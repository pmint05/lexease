import { GetProps, styled, Button as TamaguiButton } from "tamagui";

/**
 * Shared Button Component for LexEase
 *
 * NOTE: We use 'uiVariant' instead of 'variant' to avoid collision with
 * Tamagui's built-in variant which is restricted to "outlined".
 */
export const Button = styled(TamaguiButton, {
  name: "Button",
  background: "$primary",
  borderRadius: "$lg",
  minHeight: 48,
  paddingHorizontal: "$4",

  // Default accessibility
  accessible: true,
  accessibilityRole: "button",

  variants: {
    uiVariant: {
      primary: {
        background: "$primary",
        color: "$primaryForeground",
        pressStyle: { background: "$primary" },
      },
      default: {
        background: "$muted",
        color: "$foreground",
        pressStyle: { opacity: 0.8 },
      },
      secondary: {
        background: "transparent",
        borderWidth: 2,
        borderColor: "$secondary",
        color: "$secondary",
        pressStyle: { background: "$secondary", color: "$secondaryForeground" },
      },
      success: {
        background: "$accent",
        color: "$accentForeground",
        pressStyle: { opacity: 0.8 },
      },
      danger: {
        background: "$destructive",
        color: "$destructiveForeground",
        pressStyle: { opacity: 0.8 },
      },
      warning: {
        background: "$secondary",
        color: "$secondaryForeground",
        pressStyle: { opacity: 0.8 },
      },
      highlight: {
        background: "$secondary",
        color: "$secondaryForeground",
        pressStyle: { opacity: 0.8 },
      },
      ghost: {
        background: "transparent",
        color: "$primary",
        pressStyle: { background: "$muted" },
      },
      outline: {
        background: "transparent",
        borderWidth: 2,
        borderColor: "$border",
        color: "$foreground",
        pressStyle: { background: "$muted" },
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
