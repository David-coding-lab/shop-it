import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AuthSheetProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

/**
 * White rounded sheet that overlaps the hero and holds the form.
 * Reused by sign-in and sign-up.
 */
export function AuthSheet({ title, subtitle, children }: AuthSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="-mt-10 flex-1 rounded-t-[32px] bg-white px-6 pt-8 dark:bg-neutral-950"
      style={{ paddingBottom: insets.bottom + 24 }}
    >
      <Text className="text-3xl font-jakarta-bold text-brand-950 dark:text-neutral-50">
        {title}
      </Text>
      <Text className="mb-6 mt-1 text-base font-jakarta text-neutral-500 dark:text-neutral-400">
        {subtitle}
      </Text>
      {children}
    </View>
  );
}