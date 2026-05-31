import { TextClassContext } from "@/src/components/ui/text";
import { cn } from "@/src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Platform, Pressable } from "react-native";

const buttonVariants = cva(
  cn(
    "group shrink-0 flex-row items-center justify-center gap-2 rounded-xl border-2 border-transparent shadow-none",
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    }),
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary active:bg-primary/90 border-primary/15 shadow-sm shadow-black/10 text-primary-foreground",
          Platform.select({ web: "hover:bg-primary/90" }),
        ),
        success: cn(
          "bg-accent active:bg-accent/90 border-accent/20 shadow-sm shadow-black/10",
          Platform.select({ web: "hover:bg-accent/90" }),
        ),
        warning: cn(
          "bg-secondary active:bg-secondary/90 border-secondary/20 shadow-sm shadow-black/10",
          Platform.select({ web: "hover:bg-secondary/90" }),
        ),
        highlight: cn(
          "bg-secondary active:bg-secondary/90 border-secondary/20 shadow-sm shadow-black/10",
          Platform.select({ web: "hover:bg-secondary/90" }),
        ),
        destructive: cn(
          "bg-destructive active:bg-destructive/90 dark:bg-destructive/60 border-destructive/20 shadow-sm shadow-black/10",
          Platform.select({
            web: "hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          }),
        ),
        outline: cn(
          "border-border bg-background active:bg-primary/10 dark:bg-input/30 dark:border-input dark:active:bg-input/50 shadow-sm shadow-black/5",
          Platform.select({
            web: "hover:bg-primary/10 dark:hover:bg-input/50",
          }),
        ),
        secondary: cn(
          "bg-secondary active:bg-secondary/80 border-secondary/20 shadow-sm shadow-black/5",
          Platform.select({ web: "hover:bg-secondary/80" }),
        ),
        ghost: cn(
          "border-transparent active:bg-primary/10 dark:active:bg-primary/10",
          Platform.select({ web: "hover:bg-primary dark:hover:bg-primary/10" }),
        ),
        link: "",
      },
      size: {
        default: cn(
          "h-11 px-4 py-2.5 sm:h-10",
          Platform.select({ web: "has-[>svg]:px-3" }),
        ),
        sm: cn(
          "h-10 gap-1.5 rounded-lg px-3 sm:h-9",
          Platform.select({ web: "has-[>svg]:px-2.5" }),
        ),
        lg: cn(
          "h-12 rounded-2xl px-6 sm:h-11",
          Platform.select({ web: "has-[>svg]:px-4" }),
        ),
        icon: "h-11 w-11 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  cn(
    "text-foreground text-sm font-medium font-lexend",
    Platform.select({ web: "pointer-events-none transition-colors" }),
  ),
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        success: "text-accent-foreground",
        warning: "text-secondary-foreground",
        highlight: "text-secondary-foreground",
        destructive: "text-white",
        outline: cn(
          "group-active:text-accent-foreground",
          Platform.select({ web: "group-hover:text-accent-foreground" }),
        ),
        secondary: "text-secondary-foreground",
        ghost: "group-active:text-accent-foreground",
        link: cn(
          "text-primary group-active:underline",
          Platform.select({
            web: "underline-offset-4 hover:underline group-hover:underline",
          }),
        ),
      },
      size: {
        default: "",
        sm: "",
        lg: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(
          props.disabled && "opacity-50",
          buttonVariants({ variant, size }),
          className,
        )}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };

