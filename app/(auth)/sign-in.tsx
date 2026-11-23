import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import WaveHeader, { waveHeight } from "@/components/WaveHeader";
import { SignInForm } from "@/features/auth/components/SignInForm";

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const headerH = waveHeight("signin", width);
  const titleTop = headerH - (62 / 393) * width;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <WaveHeader variant="signin" />

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
            paddingTop: titleTop,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
          }}
        >
          <Text className="self-start font-rubik-bold text-[40px] leading-[48px] text-ink underline decoration-primary">
            Sign in
          </Text>
          <View className="mt-9 flex-1">
            <SignInForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
