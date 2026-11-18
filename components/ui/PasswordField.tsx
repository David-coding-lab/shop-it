import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { cn } from "@/lib/cn";

type PasswordFieldProps = {
  label: string;
  error?: string | null;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoComplete?: "password" | "new-password" | "off";
};

export function PasswordField({
  label,
  error,
  value,
  onChangeText,
  placeholder = "Minimum 8 characters",
  autoComplete = "password",
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View className="w-full gap-1.5">
      <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</Text>
      <View
        className={cn(
          "h-14 flex-row items-center rounded-2xl border bg-white dark:bg-neutral-900",
          error ? "border-red-500" : "border-neutral-300 dark:border-neutral-700",
        )}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#a3a3a3"
          secureTextEntry={!isVisible}
          autoCapitalize="none"
          autoComplete={autoComplete}
          className="h-full flex-1 px-4 text-base text-neutral-900 dark:text-neutral-100"
        />
        <Pressable
          onPress={() => setIsVisible((current) => !current)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={isVisible ? "Hide password" : "Show password"}
          className="px-4"
        >
          <Ionicons
            name={isVisible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#737373"
          />
        </Pressable>
      </View>
      {error ? (
        <Text className="text-sm text-red-600 dark:text-red-400">{error}</Text>
      ) : null}
    </View>
  );
}
