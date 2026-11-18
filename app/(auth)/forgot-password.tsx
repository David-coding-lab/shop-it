import { Screen } from "@/components/layout/Screen";
import { KeyboardScroll } from "@/components/layout/KeyboardScroll";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordScreen() {
  return (
    <Screen>
      <KeyboardScroll>
        <AuthHeader title="Forgot password" subtitle="We'll email you a reset link" />
        <ForgotPasswordForm />
      </KeyboardScroll>
    </Screen>
  );
}
