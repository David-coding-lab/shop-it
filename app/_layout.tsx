import "@/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";

import { AuthProvider } from "@/features/auth/AuthProvider";
import { useAuth } from "@/features/auth/use-auth";
import { OnboardingProvider } from "@/features/onboarding/OnboardingProvider";
import { useOnboarding } from "@/features/onboarding/use-onboarding";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash screen already hidden; ignore.
});

function RootNavigator() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const { hasSeenWelcome, isLoading: isOnboardingLoading } = useOnboarding();
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });
  const isReady = !isAuthLoading && !isOnboardingLoading && fontsLoaded;

  useEffect(() => {
    if (isReady) {
      void SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [isReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={isReady && !session && !hasSeenWelcome}>
        <Stack.Screen name="welcome" />
      </Stack.Protected>
      <Stack.Protected guard={isReady && !session && hasSeenWelcome}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isReady && Boolean(session)}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OnboardingProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </OnboardingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
