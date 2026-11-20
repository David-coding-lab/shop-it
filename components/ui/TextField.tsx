import { Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";

import { cn } from "@/lib/cn";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string | null;
  containerClassName?: string;
};

export function TextField({ label, error, containerClassName, ...inputProps }: TextFieldProps) {
  return (
    <View className={cn("w-full gap-1.5", containerClassName)}>
      <Text className="text-sm font-jakarta-medium text-neutral-700 dark:text-neutral-300">{label}</Text>
      <TextInput
        placeholderTextColor="#a3a3a3"
        autoCapitalize="none"
        className={cn(
          "h-14 rounded-2xl border bg-white px-4 font-jakarta text-base text-neutral-900 dark:border-brand-800 dark:bg-brand-900 dark:text-neutral-100",
          error ? "border-red-500" : "border-neutral-300",
        )}
        {...inputProps}
      />
      {error ? (
        <Text className="text-sm text-red-600 dark:text-red-400">{error}</Text>
      ) : null}
    </View>
  );
}
