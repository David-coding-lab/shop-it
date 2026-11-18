import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type ScreenProps = {
  children: ReactNode;
  className?: string;
};

export function Screen({ children, className }: ScreenProps) {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className={cn("flex-1 bg-white dark:bg-neutral-950", className)}
    >
      {children}
    </SafeAreaView>
  );
}
