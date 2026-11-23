import { createContext } from "react";

export type OnboardingContextValue = {
  hasSeenWelcome: boolean;
  isLoading: boolean;
  completeWelcome: () => Promise<void>;
};

export const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);
