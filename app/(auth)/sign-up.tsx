import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { KeyboardScroll } from "@/components/layout/KeyboardScroll";
import { Screen } from "@/components/layout/Screen";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpScreen() {
  return (
    <Screen>
      <KeyboardScroll>
        <View className="mb-8 items-center gap-3">
          <View className="h-16 w-16 items-center justify-center rounded-3xl bg-brand-600">
            <Ionicons name="storefront" size={32} color="#ffffff" />
          </View>
          <Text className="text-sm font-jakarta-semibold uppercase tracking-widest text-brand-600 dark:text-brand-300">
            Shop-it
          </Text>
          <Text className="text-center text-3xl font-jakarta-bold text-neutral-900 dark:text-neutral-50">
            Create account
          </Text>
          <Text className="text-center text-base font-jakarta text-neutral-500 dark:text-neutral-400">
            Join Shop-it to book trusted professionals near you
          </Text>
        </View>
        <SignUpForm />
      </KeyboardScroll>
    </Screen>
  );
}
