import { Text, View } from "react-native";
import { Link } from "expo-router";

import { KeyboardScroll } from "@/components/layout/KeyboardScroll";
import { Screen } from "@/components/layout/Screen";

export default function ForgotPasswordScreen() {
  return (
    <Screen>
      <KeyboardScroll>
        <View className="items-center gap-3">
          <Text className="text-center text-3xl font-jakarta-bold text-neutral-900 dark:text-neutral-50">
            Forgot password
          </Text>
          <Text className="text-center text-base font-jakarta text-neutral-500 dark:text-neutral-400">
            Password reset is coming soon.
          </Text>
          <Link
            href="/sign-in"
            className="mt-2 font-jakarta-semibold text-brand-600 dark:text-brand-300"
          >
            Back to sign in
          </Link>
        </View>
      </KeyboardScroll>
    </Screen>
  );
}
