import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { OnboardingContext } from "@/features/onboarding/onboarding-context";

const HAS_SEEN_WELCOME_KEY = "@shopit/has_seen_welcome";

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY)
      .then((value) => {
        if (!mounted) return;
        setHasSeenWelcome(value === "true");
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        console.warn("[onboarding] failed to read welcome flag", error);
        if (!mounted) return;
        setHasSeenWelcome(false);
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const completeWelcome = useCallback(async () => {
    setHasSeenWelcome(true);
    try {
      await AsyncStorage.setItem(HAS_SEEN_WELCOME_KEY, "true");
    } catch (error) {
      console.warn("[onboarding] failed to save welcome flag", error);
    }
  }, []);

  const value = useMemo(
    () => ({ hasSeenWelcome, isLoading, completeWelcome }),
    [hasSeenWelcome, isLoading, completeWelcome],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
