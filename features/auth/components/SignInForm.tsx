import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import type { ComponentRef } from "react";

import UnderlineField, { colors } from "@/components/ui/UnderlineField";
import { signInSchema } from "@/features/auth/auth-schemas";
import { useAuth } from "@/features/auth/use-auth";
import { useCooldown } from "@/features/auth/use-cooldown";
import { EMAIL_MAX_LENGTH, toFieldErrors } from "@/lib/validation";

const MAX_FAILED_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 30;

export function SignInForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { secondsLeft, isCoolingDown, start: startCooldown } = useCooldown(COOLDOWN_SECONDS);

  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const isDisabled = isSubmitting || isCoolingDown;

  async function handleSubmit() {
    if (isDisabled) return;
    setAuthError(null);

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errors = toFieldErrors(parsed.error);
      setEmailError(errors.email ?? null);
      setPasswordError(errors.password ?? null);
      return;
    }

    setEmailError(null);
    setPasswordError(null);

    setIsSubmitting(true);
    const { error } = await signIn(parsed.data);
    setIsSubmitting(false);

    if (error) {
      setAuthError(error);
      const nextAttempts = failedAttempts + 1;

      if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
        setFailedAttempts(0);
        startCooldown();
      } else {
        setFailedAttempts(nextAttempts);
      }
      return;
    }

    setFailedAttempts(0);
  }

  return (
    <View className="flex-1 justify-between">
      <View className="gap-7">
        <UnderlineField
          label="Email"
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
          error={emailError}
          placeholder="demo@email.com"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          textContentType="emailAddress"
          maxLength={EMAIL_MAX_LENGTH}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <UnderlineField
          ref={passwordRef}
          label="Password"
          icon="lock-outline"
          password
          value={password}
          onChangeText={setPassword}
          error={passwordError}
          placeholder="**********"
          autoComplete="password"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <View className="-mt-1 flex-row items-center justify-between">
          <Pressable
            onPress={() => setRememberMe((v) => !v)}
            hitSlop={10}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberMe }}
            className="flex-row items-center gap-2"
          >
            <MaterialIcons
              name={rememberMe ? "radio-button-checked" : "radio-button-unchecked"}
              size={24}
              color={rememberMe ? colors.primary : colors.icon}
            />
            <Text className="font-rubik text-[15px] text-ink">Remember Me</Text>
          </Pressable>

          <Link href="/forgot-password" className="font-rubik-medium text-[15px] text-primary">
            Forgot Password?
          </Link>
        </View>

        {authError ? (
          <View className="flex-row items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5">
            <MaterialIcons name="error-outline" size={18} color={colors.error} />
            <Text className="flex-1 font-rubik-medium text-sm text-red-700">{authError}</Text>
          </View>
        ) : null}
      </View>

      <View className="gap-[18px] pt-8">
        <Pressable
          onPress={handleSubmit}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDisabled }}
          className={`h-[52px] items-center justify-center rounded-[10px] bg-primary ${
            isDisabled ? "opacity-80" : "active:opacity-90"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-rubik-medium text-[19px] text-white">
              {isCoolingDown ? `Try again in ${secondsLeft}s` : "Sign in"}
            </Text>
          )}
        </Pressable>

        <View className="flex-row justify-center gap-1.5">
          <Text className="font-rubik text-base text-neutral-500">Don’t have an Account ?</Text>
          <Link replace href="/sign-up" className="font-rubik-medium text-base text-primary">
            Sign up
          </Link>
        </View>
      </View>
    </View>
  );
}