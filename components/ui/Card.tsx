import { View } from "react-native";
import type { ViewProps } from "react-native";

import { cn } from "@/lib/cn";

export function Card({ className, ...viewProps }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn(
        "rounded-2xl border border-[#eae5f4] bg-white p-5 dark:border-brand-800 dark:bg-brand-900",
        className,
      )}
      {...viewProps}
    />
  );
}
