import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="mb-8 items-center gap-3">
      <View className="h-16 w-16 items-center justify-center rounded-3xl bg-brand-600">
        <Ionicons name="storefront" size={32} color="#ffffff" />
      </View>
      <Text className="text-sm font-jakarta-semibold uppercase tracking-widest text-brand-600 dark:text-brand-300">
        Shop-it
      </Text>
      <Text className="text-center text-3xl font-jakarta-bold text-neutral-900 dark:text-neutral-50">
        {title}
      </Text>
      <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
        {subtitle}
      </Text>
    </View>
  );
}
