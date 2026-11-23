import { useState, type ReactNode } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type TextFieldProps = TextInputProps & {
  label: string;
  error?: string | null;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Optional element rendered inside the field on the right (e.g. a show/hide toggle). */
  right?: ReactNode;
};

export function TextField({
  label,
  error,
  icon,
  right,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  const boxStyle = error
    ? "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950"
    : focused
      ? "border-brand-600 bg-white dark:border-brand-400 dark:bg-neutral-900"
      : "border-brand-200 bg-brand-50 dark:border-neutral-800 dark:bg-neutral-900";

  const iconColor = error ? "#dc2626" : focused ? "#7b2cbf" : "#9d4edd";

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-jakarta-semibold text-brand-800 dark:text-neutral-200">
        {label}
      </Text>

      <View className={`h-[52px] flex-row items-center gap-3 rounded-2xl border px-4 ${boxStyle}`}>
        {icon ? <Ionicons name={icon} size={20} color={iconColor} /> : null}
        <TextInput
          {...inputProps}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor="#9a93a8"
          className="flex-1 text-base font-jakarta text-neutral-900 dark:text-neutral-50"
        />
        {right}
      </View>

      {error ? (
        <Text className="text-xs font-jakarta-medium text-red-600 dark:text-red-400">{error}</Text>
      ) : null}
    </View>
  );
}