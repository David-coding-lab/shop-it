import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import type { ReactNode } from "react";

type KeyboardScrollProps = {
  children: ReactNode;
};

export function KeyboardScroll({ children }: KeyboardScrollProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
