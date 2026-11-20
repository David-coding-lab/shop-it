import { Pressable, Text, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatDistance, formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";

type ProviderCardProps = {
  name: string;
  category: string;
  rating: number | null;
  reviewCount?: number | null;
  distanceM: number | null;
  startingPrice: number | null;
  onPress?: () => void;
  className?: string;
};

export function ProviderCard({
  name,
  category,
  rating,
  reviewCount,
  distanceM,
  startingPrice,
  onPress,
  className,
}: ProviderCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${category}${rating != null ? `, rated ${rating.toFixed(1)}` : ""}`}
      className={cn(
        "flex-row gap-3 rounded-2xl border border-[#eae5f4] bg-white p-4 active:bg-brand-50 dark:border-brand-800 dark:bg-brand-900 dark:active:bg-brand-800",
        className,
      )}
    >
      <Avatar name={name} size={64} />
      <View className="flex-1 gap-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text
            className="flex-1 font-jakarta-semibold text-base text-neutral-900 dark:text-neutral-50"
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text className="font-jakarta-medium text-xs text-neutral-500 dark:text-neutral-400">
            {formatDistance(distanceM)}
          </Text>
        </View>
        <Text className="font-jakarta-medium text-xs uppercase tracking-wide text-brand-600 dark:text-brand-300">
          {category}
        </Text>
        <View className="flex-row items-center gap-2 pt-0.5">
          <RatingStars rating={rating} reviewCount={reviewCount} size={13} />
        </View>
        {startingPrice != null ? (
          <Text className="pt-0.5 font-jakarta-medium text-xs text-neutral-600 dark:text-neutral-300">
            From <Text className="font-jakarta-semibold text-neutral-900 dark:text-neutral-50">{formatNaira(startingPrice)}</Text>
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
