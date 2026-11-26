import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmailSent } from "@/features/auth/components/EmailSent";
import type { EmailSentMode } from "@/features/auth/components/EmailSent";
import { emailSchema } from "@/lib/validation";

export default function CheckEmailScreen() {
  const { email, mode } = useLocalSearchParams<{ email?: string; mode?: string }>();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const emailMode: EmailSentMode = mode === "reset" ? "reset" : "signup";
  const isReset = emailMode === "reset";
  const parsedEmail = emailSchema.safeParse(email ?? "");
  const safeEmail = parsedEmail.success ? parsedEmail.data : "";

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: Math.max(insets.top + 24, height * 0.2535),
          paddingBottom: Math.max(insets.bottom + 2, 18),
        }}
      >
        <EmailSent
          email={safeEmail}
          mode={emailMode}
          messagePrefix={isReset ? "We sent a reset link to " : undefined}
          messageSuffix={
            isReset ? ". Follow the link to choose a new password." : undefined
          }
        />
      </ScrollView>
    </View>
  );
}
