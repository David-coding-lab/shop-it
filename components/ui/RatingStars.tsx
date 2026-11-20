import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import { cn } from "@/lib/cn";

type RatingStarsProps = {
  rating: number | null | undefined;
  reviewCount?: number | null;
  size?: number;
  showCount?: boolean;
  className?: string;
};

const STAR_FILL_COLOR = "#f59e0b";

function starName(rating: number, index: number): "star" | "star-half" | "star-outline" {
  const delta = rating - index;
  if (delta >= 0.75) return "star";
  if (delta >= 0.35) return "star-half";
  return "star-outline";
}

export function RatingStars({
  rating,
  reviewCount,
  size = 16,
  showCount = true,
  className,
}: RatingStarsProps) {
  const { colorScheme } = useColorScheme();
  const starEmptyColor = colorScheme === "dark" ? "#52525b" : "#d4d4d8";

  if (rating == null || !Number.isFinite(rating)) {
    return (
      <View className={cn("flex-row items-center gap-1", className)}>
        <Text className="font-jakarta-medium text-xs text-neutral-500 dark:text-neutral-400">
          New provider
        </Text>
      </View>
    );
  }

  const clamped = Math.min(5, Math.max(0, rating));

  return (
    <View className={cn("flex-row items-center gap-1", className)}>
      <View className="flex-row items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Ionicons
            key={index}
            name={starName(clamped, index)}
            size={size}
            color={starName(clamped, index) === "star-outline" ? starEmptyColor : STAR_FILL_COLOR}
          />
        ))}
      </View>
      <Text className="font-jakarta-semibold text-xs text-neutral-700 dark:text-neutral-200">
        {clamped.toFixed(1)}
      </Text>
      {showCount && reviewCount != null ? (
        <Text className="font-jakarta text-xs text-neutral-500 dark:text-neutral-400">
          ({reviewCount})
        </Text>
      ) : null}
    </View>
  );
}
