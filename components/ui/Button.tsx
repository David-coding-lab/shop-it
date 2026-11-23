import { ActivityIndicator, Pressable, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

const containerStyles = {
  primary: "bg-brand-600 active:bg-brand-700",
  secondary: "border border-brand-200 bg-brand-50 active:bg-brand-100 dark:border-neutral-800 dark:bg-neutral-900",
} as const;

const textStyles = {
  primary: "text-white",
  secondary: "text-brand-700 dark:text-brand-200",
} as const;

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      className={`h-[52px] flex-row items-center justify-center gap-2 rounded-2xl ${containerStyles[variant]} ${
        inactive ? "opacity-70" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#ffffff" : "#7b2cbf"} />
      ) : (
        <Text className={`text-base font-jakarta-semibold ${textStyles[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}