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
      className={cn("flex-1 bg-[#F8F6FC] dark:bg-brand-950", className)}
    >
      {children}
    </SafeAreaView>
  );
}
