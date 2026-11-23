import { useState } from "react";
import { Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useAuth } from "@/features/auth/use-auth";
import { isValidEmail } from "@/lib/validation";

export function SignInForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setAuthError(null);

    const trimmedEmail = email.trim();
    const emailValid = isValidEmail(trimmedEmail);
    const passwordValid = password.length > 0;
    setEmailError(emailValid ? null : "Enter a valid email address.");
    setPasswordError(passwordValid ? null : "Enter your password.");
    if (!emailValid || !passwordValid) return;

    setIsSubmitting(true);
    const { error } = await signIn(trimmedEmail, password);
    setIsSubmitting(false);

    if (error) setAuthError(error);
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
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        placeholder="Enter your password"
        autoComplete="password"
        secureTextEntry
      />

      <View className="-mt-1 items-end">
        <Link
          href="/forgot-password"
          className="text-sm font-jakarta-semibold text-brand-600 dark:text-brand-300"
        >
          Forgot password?
        </Link>
      </View>

      {authError ? (
        <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 dark:bg-red-950">
          <Ionicons name="alert-circle" size={18} color="#dc2626" />
          <Text className="flex-1 text-sm font-jakarta-medium text-red-700 dark:text-red-300">
            {authError}
          </Text>
        </View>
      ) : null}

      <Button title="Sign in" onPress={handleSubmit} loading={isSubmitting} />

      <View className="flex-row items-center justify-center gap-1.5">
        <Ionicons name="shield-checkmark" size={15} color="#7b2cbf" />
        <Text className="text-xs font-jakarta text-neutral-500 dark:text-neutral-400">
          Verified, licensed and insured pros
        </Text>
      </View>

      <View className="flex-row justify-center gap-1">
        <Text className="font-jakarta text-neutral-500 dark:text-neutral-400">
          Need an account?
        </Text>
        <Link
          href="/sign-up"
          className="font-jakarta-semibold text-brand-600 dark:text-brand-300"
        >
          Sign up
        </Link>
      </View>
    </View>
  );
}