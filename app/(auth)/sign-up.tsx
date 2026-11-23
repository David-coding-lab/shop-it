import { Rubik_400Regular, Rubik_500Medium, Rubik_700Bold, useFonts } from "@expo-google-fonts/rubik";
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

import WaveHeader, { waveHeight } from "@/components/WaveHeader";
import { EmailSent } from "@/features/auth/components/EmailSent";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [fontsLoaded] = useFonts({ Rubik_400Regular, Rubik_500Medium, Rubik_700Bold });
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (!fontsLoaded) return null;

  const headerH = waveHeight("form", width);
  const titleTop = (228 / 290) * headerH;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <WaveHeader variant="form" />

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
            paddingTop: sentTo ? headerH + 8 : titleTop,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
          }}
        >
          {sentTo ? (
            <EmailSent email={sentTo} />
          ) : (
            <>
              <Text className="self-start text-[40px] leading-[48px] font-jakarta-bold text-neutral-700 underline decoration-brand-600">
                Sign up
              </Text>
              <View className="mt-9 flex-grow">
                <SignUpForm onConfirmationSent={setSentTo} />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
