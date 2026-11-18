import { useState } from "react";
import { Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { PasswordField } from "@/components/ui/PasswordField";
import { useAuth } from "@/features/auth/use-auth";
import { isValidEmail, validatePassword } from "@/lib/validation";

export function SignUpForm() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmationSent, setIsConfirmationSent] = useState(false);

  async function handleSubmit() {
    setAuthError(null);

    const trimmedEmail = email.trim();
    const passwordIssue = validatePassword(password);
    const errors = {
      email: isValidEmail(trimmedEmail) ? null : "Enter a valid email address.",
      password: passwordIssue,
      confirm: confirm === password ? null : "Passwords do not match.",
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setIsSubmitting(true);
    const result = await signUp(trimmedEmail, password, fullName);
    setIsSubmitting(false);

    if (result.error) {
      setAuthError(result.error);
      return;
    }
    if (result.needsConfirmation) {
      setIsConfirmationSent(true);
    }
  }

  if (isConfirmationSent) {
    return (
      <View className="items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950">
        <Ionicons name="mail-outline" size={40} color="#059669" />
        <Text className="text-center text-lg font-semibold text-emerald-800 dark:text-emerald-200">
          Check your email
        </Text>
        <Text className="text-center text-sm text-emerald-700 dark:text-emerald-300">
          We sent a confirmation link to {email.trim()}. Confirm it, then sign in.
        </Text>
        <Link href="/sign-in" className="font-semibold text-indigo-600 dark:text-indigo-400">
          Back to sign in
        </Link>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <TextField
        label="Full name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Ada Lovelace"
        autoComplete="name"
        textContentType="name"
        autoCapitalize="words"
      />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        textContentType="emailAddress"
      />
      <PasswordField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        autoComplete="new-password"
      />
      <PasswordField
        label="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        error={fieldErrors.confirm}
        autoComplete="new-password"
        placeholder="Repeat your password"
      />

      {authError ? (
        <Text className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {authError}
        </Text>
      ) : null}

      <Button title="Create account" onPress={handleSubmit} loading={isSubmitting} />

      <View className="flex-row justify-center gap-1">
        <Text className="text-neutral-500 dark:text-neutral-400">Already have an account?</Text>
        <Link href="/sign-in" className="font-semibold text-indigo-600 dark:text-indigo-400">
          Sign in
        </Link>
      </View>
    </View>
  );
}
