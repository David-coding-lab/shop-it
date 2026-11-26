import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import WaveHeader from "@/components/WaveHeader";
import { EmailSent } from "@/features/auth/components/EmailSent";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { useAuth } from "@/features/auth/use-auth";

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { resetPassword } = useAuth();
  const [sentTo, setSentTo] = useState<string | null>(null);

  // Same title position as the sign-in screen (design: ~y 360 of 852)
  const titleTop = (360 / 393) * width;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style={sentTo ? "dark" : "light"} />
      {sentTo ? null : <WaveHeader variant="forgot" />}

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: sentTo ? Math.max(insets.top + 24, height * 0.2535) : titleTop,
            paddingBottom: sentTo
              ? Math.max(insets.bottom + 2, 18)
              : Math.max(insets.bottom, 16) + 8,
          }}
        >
          {sentTo ? (
            <EmailSent
              email={sentTo}
              mode="reset"
              messagePrefix="We sent a reset link to "
              messageSuffix=". Follow the link to choose a new password."
            />
          ) : (
            <>
              <Text className="self-start font-rubik-bold text-[40px] leading-[48px] text-ink underline decoration-primary">
                Forgot Password
              </Text>
              <View className="mt-9 flex-1">
                <ForgotPasswordForm onSendCode={resetPassword} onSent={setSentTo} />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
