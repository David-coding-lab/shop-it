import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ArrowButton from "@/features/onboarding/components/ArrowButton";
import OnboardingBackground, {
  BG_HEIGHT,
  BG_WIDTH,
} from "@/features/onboarding/components/OnboardingBackground";
import { useOnboarding } from "@/features/onboarding/use-onboarding";

export const colors = {
  primary: "#7B2CBF",
  title: "#404040",
  subtext: "#A3A3A3",
  action: "#737373",
  background: "#FFFFFF",
};

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { completeWelcome } = useOnboarding();

  const bgHeight = (width * BG_HEIGHT) / BG_WIDTH;

  async function handleContinue() {
    await completeWelcome();
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <OnboardingBackground />

      <View style={[styles.content, { top: bgHeight + 22 }]}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Find trusted professionals near you, book services with ease, and enjoy quality service
          every step of the way.
        </Text>
      </View>

      <View style={[styles.footer, { bottom: Math.max(insets.bottom, 16) + 14 }]}>
        <Pressable onPress={() => void handleContinue()} hitSlop={12}>
          <Text style={styles.continue}>Continue</Text>
        </Pressable>
        <ArrowButton onPress={() => void handleContinue()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { position: "absolute", left: 20, right: 20 },
  title: {
    fontFamily: "Rubik_700Bold",
    fontSize: 40,
    lineHeight: 48,
    color: colors.title,
  },
  subtitle: {
    marginTop: 8,
    maxWidth: 300,
    fontFamily: "Rubik_400Regular",
    fontSize: 15,
    lineHeight: 20,
    color: colors.subtext,
  },
  footer: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
  },
  continue: {
    fontFamily: "Rubik_500Medium",
    fontSize: 16,
    color: colors.action,
  },
});
