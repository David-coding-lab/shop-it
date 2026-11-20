import { useState } from "react";
import { Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useAuth } from "@/features/auth/use-auth";
import { isValidEmail } from "@/lib/validation";

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit() {
    setAuthError(null);

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError(null);

    setIsSubmitting(true);
    const { error } = await resetPassword(trimmedEmail);
    setIsSubmitting(false);

    if (error) {
      setAuthError(error);
      return;
    }
    setIsSent(true);
  }

  if (isSent) {
    return (
      <View className="items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950">
        <Ionicons name="mail-outline" size={40} color="#059669" />
        <Text className="text-center text-lg font-semibold text-emerald-800 dark:text-emerald-200">
          Reset link sent
        </Text>
        <Text className="text-center text-sm text-emerald-700 dark:text-emerald-300">
          If an account exists for {email.trim()}, you will receive a password reset email shortly.
        </Text>
        <Link href="/sign-in" className="font-semibold text-brand-600 dark:text-brand-300">
          Back to sign in
        </Link>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        textContentType="emailAddress"
      />

      {authError ? (
        <Text className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {authError}
        </Text>
      ) : null}

      <Button title="Send reset link" onPress={handleSubmit} loading={isSubmitting} />

      <View className="flex-row justify-center gap-1">
        <Text className="text-neutral-500 dark:text-neutral-400">Remembered it?</Text>
        <Link href="/sign-in" className="font-semibold text-brand-600 dark:text-brand-300">
          Sign in
        </Link>
      </View>
    </View>
  );
}
