import { View } from "react-native";
import type { ViewProps } from "react-native";

import { cn } from "@/lib/cn";

export function Card({ className, ...viewProps }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900",
        className,
      )}
      {...viewProps}
    />
  );
}
