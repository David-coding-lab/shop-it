import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn("flex-1 items-center justify-center gap-3 px-8 py-12", className)}>
      <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900">
        <Ionicons name={icon} size={30} color="#7b2cbf" />
      </View>
      <Text className="text-center font-jakarta-bold text-lg text-neutral-900 dark:text-neutral-50">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-center font-jakarta text-sm leading-5 text-neutral-500 dark:text-neutral-400">
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}
