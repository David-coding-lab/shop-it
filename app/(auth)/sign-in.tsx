import { Screen } from "@/components/layout/Screen";
import { KeyboardScroll } from "@/components/layout/KeyboardScroll";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { SignInForm } from "@/features/auth/components/SignInForm";

export default function SignInScreen() {
  return (
    <Screen>
      <KeyboardScroll>
        <AuthHeader title="Welcome back" subtitle="Sign in to your account" />
        <SignInForm />
      </KeyboardScroll>
    </Screen>
  );
}
