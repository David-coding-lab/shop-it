import { Screen } from "@/components/layout/Screen";
import { KeyboardScroll } from "@/components/layout/KeyboardScroll";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpScreen() {
  return (
    <Screen>
      <KeyboardScroll>
        <AuthHeader title="Create account" subtitle="Start building with Expo and Supabase" />
        <SignUpForm />
      </KeyboardScroll>
    </Screen>
  );
}
