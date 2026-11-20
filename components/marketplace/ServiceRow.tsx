import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";

type ServiceRowProps = {
  title: string;
  description?: string | null;
  price: number;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
};

export function ServiceRow({
  title,
  description,
  price,
  selected = false,
  onPress,
  className,
}: ServiceRowProps) {
  const content = (
    <>
      {onPress ? (
        <View
          className={cn(
            "h-6 w-6 items-center justify-center rounded-full border",
            selected
              ? "border-brand-600 bg-brand-600 dark:border-brand-500 dark:bg-brand-500"
              : "border-neutral-300 dark:border-brand-800",
          )}
        >
          {selected ? <Ionicons name="checkmark" size={14} color="#ffffff" /> : null}
        </View>
      ) : null}
      <View className="flex-1 gap-0.5">
        <Text className="font-jakarta-semibold text-base text-neutral-900 dark:text-neutral-50">
          {title}
        </Text>
        {description ? (
          <Text
            className="font-jakarta text-sm text-neutral-500 dark:text-neutral-400"
            numberOfLines={2}
          >
            {description}
          </Text>
        ) : null}
      </View>
      <Text className="font-jakarta-bold text-base text-brand-700 dark:text-brand-300">
        {formatNaira(price)}
      </Text>
    </>
  );

  const rowClassName = cn(
    "flex-row items-center gap-3 rounded-2xl border px-4 py-4",
    selected
      ? "border-brand-600 bg-brand-50 dark:border-brand-500 dark:bg-brand-500/10"
      : "border-[#eae5f4] bg-white dark:border-brand-800 dark:bg-brand-900",
    className,
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={`${title}, ${formatNaira(price)}`}
        className={rowClassName}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={rowClassName}>{content}</View>;
}
