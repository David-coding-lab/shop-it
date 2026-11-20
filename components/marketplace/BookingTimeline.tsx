import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import type { BookingStatus } from "@/types/booking.types";

type TimelineStepKey = "requested" | "accepted" | "paid" | "completed" | "reviewed";

type BookingTimelineProps = {
  status: BookingStatus;
  timestamps?: Partial<Record<TimelineStepKey, string | null>>;
  terminalNote?: string | null;
  className?: string;
};

const FLOW: { key: TimelineStepKey; label: string }[] = [
  { key: "requested", label: "Request sent" },
  { key: "accepted", label: "Provider accepted" },
  { key: "paid", label: "Payment received" },
  { key: "completed", label: "Job completed" },
  { key: "reviewed", label: "Review submitted" },
];

const FLOW_ORDER: Record<TimelineStepKey, number> = {
  requested: 0,
  accepted: 1,
  paid: 2,
  completed: 3,
  reviewed: 4,
};

export function BookingTimeline({ status, timestamps, terminalNote, className }: BookingTimelineProps) {
  const isTerminalExit = status === "declined" || status === "cancelled";
  const statusOrder =
    status === "declined" || status === "cancelled"
      ? -1
      : FLOW_ORDER[status as TimelineStepKey];

  const isStepDone = (key: TimelineStepKey): boolean => {
    const timestamp = timestamps?.[key];
    if (timestamps !== undefined && key in timestamps) {
      return Boolean(timestamp);
    }
    if (statusOrder >= 0) {
      return FLOW_ORDER[key] <= statusOrder;
    }
    return key === "requested";
  };

  const doneMap = FLOW.map((step) => isStepDone(step.key));

  return (
    <View className={cn("gap-0", className)}>
      {isTerminalExit ? (
        <View
          className={cn(
            "mb-4 flex-row items-center gap-2 rounded-2xl border px-4 py-3",
            status === "declined"
              ? "border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10"
              : "border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/60",
          )}
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={status === "declined" ? "#ef4444" : "#a3a3a3"}
          />
          <View className="flex-1">
            <Text
              className={cn(
                "font-jakarta-semibold text-sm",
                status === "declined"
                  ? "text-red-800 dark:text-red-300"
                  : "text-neutral-700 dark:text-neutral-300",
              )}
            >
              {status === "declined" ? "Declined by the provider" : "Booking cancelled"}
            </Text>
            {terminalNote ? (
              <Text className="font-jakarta text-xs text-neutral-500 dark:text-neutral-400">
                {terminalNote}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {FLOW.map((step, index) => {
        const done = doneMap[index];
        const isLast = index === FLOW.length - 1;
        const lineDone = done && (isLast || doneMap[index + 1]);

        return (
          <View key={step.key} className="flex-row gap-3">
            <View className="w-8 items-center">
              <View
                className={cn(
                  "h-8 w-8 items-center justify-center rounded-full border",
                  done
                    ? "border-brand-600 bg-brand-600 dark:border-brand-500 dark:bg-brand-500"
                    : "border-neutral-300 bg-white dark:border-brand-800 dark:bg-brand-900",
                )}
              >
                {done ? (
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                ) : (
                  <Text className="font-jakarta-semibold text-xs text-neutral-400 dark:text-neutral-500">
                    {index + 1}
                  </Text>
                )}
              </View>
              {!isLast ? (
                <View
                  className={cn(
                    "w-0.5 flex-1",
                    lineDone ? "bg-brand-600 dark:bg-brand-500" : "bg-neutral-200 dark:bg-brand-800",
                  )}
                />
              ) : null}
            </View>
            <View className="flex-1 pb-6 pt-1">
              <Text
                className={cn(
                  "font-jakarta-semibold text-sm",
                  done
                    ? "text-neutral-900 dark:text-neutral-50"
                    : "text-neutral-400 dark:text-neutral-500",
                )}
              >
                {step.label}
              </Text>
              {timestamps?.[step.key] ? (
                <Text className="font-jakarta text-xs text-neutral-500 dark:text-neutral-400">
                  {formatDateTime(timestamps[step.key])}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
