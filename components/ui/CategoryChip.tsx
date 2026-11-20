import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import { cn } from "@/lib/cn";

type CategoryChipProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress: () => void;
  className?: string;
};

export function CategoryChip({ label, icon, selected = false, onPress, className }: CategoryChipProps) {
  const { colorScheme } = useColorScheme();
  const idleIconColor = colorScheme === "dark" ? "#c77dff" : "#7b2cbf";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      className={cn(
        "h-11 flex-row items-center gap-1.5 rounded-full border px-4",
        selected
          ? "border-brand-600 bg-brand-600 dark:border-brand-500 dark:bg-brand-500"
          : "border-[#eae5f4] bg-white dark:border-brand-800 dark:bg-brand-900",
        className,
      )}
    >
      <Ionicons
        name={icon}
        size={16}
        color={selected ? "#ffffff" : idleIconColor}
      />
      <Text
        className={cn(
          "font-jakarta-medium text-sm",
          selected ? "text-white" : "text-neutral-800 dark:text-neutral-100",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
