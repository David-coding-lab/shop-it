import { Text, View } from "react-native";

import { cn } from "@/lib/cn";
import type { BookingStatus } from "@/types/booking.types";

type StatusBadgeProps = {
  status: BookingStatus;
  className?: string;
};

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; container: string; text: string; dot: string }
> = {
  requested: {
    label: "Requested",
    container: "border-amber-200 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-400/10",
    text: "text-amber-800 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  accepted: {
    label: "Accepted",
    container: "border-sky-200 bg-sky-50 dark:border-sky-400/20 dark:bg-sky-400/10",
    text: "text-sky-800 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  paid: {
    label: "Paid",
    container: "border-brand-200 bg-brand-50 dark:border-brand-500/25 dark:bg-brand-500/10",
    text: "text-brand-800 dark:text-brand-300",
    dot: "bg-brand-500",
  },
  completed: {
    label: "Completed",
    container: "border-teal-200 bg-teal-50 dark:border-teal-400/20 dark:bg-teal-400/10",
    text: "text-teal-800 dark:text-teal-300",
    dot: "bg-teal-500",
  },
  reviewed: {
    label: "Reviewed",
    container:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10",
    text: "text-emerald-800 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  declined: {
    label: "Declined",
    container: "border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10",
    text: "text-red-800 dark:text-red-300",
    dot: "bg-red-500",
  },
  cancelled: {
    label: "Cancelled",
    container:
      "border-neutral-200 bg-neutral-100 dark:border-neutral-600/40 dark:bg-neutral-800/60",
    text: "text-neutral-700 dark:text-neutral-300",
    dot: "bg-neutral-400",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View
      className={cn(
        "flex-row items-center gap-1.5 self-start rounded-full border px-2.5 py-1",
        config.container,
        className,
      )}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${config.label}`}
    >
      <View className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      <Text className={cn("font-jakarta-semibold text-xs", config.text)}>{config.label}</Text>
    </View>
  );
}
