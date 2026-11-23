import { Redirect } from "expo-router";

import { useAuth } from "@/features/auth/use-auth";
import { useOnboarding } from "@/features/onboarding/use-onboarding";

export default function Index() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const { hasSeenWelcome, isLoading: isOnboardingLoading } = useOnboarding();

  if (isAuthLoading || isOnboardingLoading) {
    return null;
  }

  if (session) {
    return <Redirect href="/(app)" />;
  }

  if (!hasSeenWelcome) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/sign-in" />;
}
