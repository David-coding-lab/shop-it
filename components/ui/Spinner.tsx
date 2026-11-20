import { ActivityIndicator, View } from "react-native";

import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <View className={cn("flex-1 items-center justify-center", className)}>
      <ActivityIndicator size="large" color="#7b2cbf" />
    </View>
  );
}
