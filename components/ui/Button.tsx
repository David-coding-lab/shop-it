import { ActivityIndicator, Pressable, Text } from "react-native";
import type { PressableProps } from "react-native";

import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "danger";

type ButtonProps = Omit<PressableProps, "children"> & {
  title: string;
  variant?: Variant;
  loading?: boolean;
  className?: string;
};

const containerVariants: Record<Variant, string> = {
  primary: "bg-brand-600 active:bg-brand-700",
  outline:
    "border border-neutral-300 dark:border-neutral-700 bg-transparent active:bg-neutral-100 dark:active:bg-neutral-800",
  ghost: "bg-transparent active:bg-neutral-100 dark:active:bg-neutral-800",
  danger: "bg-red-600 active:bg-red-700",
};

const textVariants: Record<Variant, string> = {
  primary: "text-white",
  outline: "text-neutral-900 dark:text-neutral-100",
  ghost: "text-brand-600 dark:text-brand-300",
  danger: "text-white",
};

const spinnerColors: Record<Variant, string> = {
  primary: "#ffffff",
  outline: "#7b2cbf",
  ghost: "#7b2cbf",
  danger: "#ffffff",
};

export function Button({
  title,
  variant = "primary",
  loading = false,
  disabled,
  className,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...pressableProps}
      disabled={isDisabled}
      className={cn(
        "h-14 flex-row items-center justify-center rounded-2xl px-4",
        containerVariants[variant],
        isDisabled && "opacity-50",
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColors[variant]} />
      ) : (
        <Text className={cn("text-base font-jakarta-semibold", textVariants[variant])}>{title}</Text>
      )}
    </Pressable>
  );
}
