import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import type { ComponentRef } from "react";

import UnderlineField, { colors } from "@/components/ui/UnderlineField";
import { signUpSchema } from "@/features/auth/auth-schemas";
import { useAuth } from "@/features/auth/use-auth";
import { useCooldown } from "@/features/auth/use-cooldown";
import {
  EMAIL_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  toFieldErrors,
} from "@/lib/validation";

type Props = {
  onConfirmationSent: (email: string) => void;
};

const ERROR_COOLDOWN_SECONDS = 10;

export function SignUpForm({ onConfirmationSent }: Props) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { secondsLeft, isCoolingDown, start: startCooldown } = useCooldown(
    ERROR_COOLDOWN_SECONDS,
  );

  const emailRef = useRef<ComponentRef<typeof TextInput>>(null);
  const phoneRef = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const confirmRef = useRef<ComponentRef<typeof TextInput>>(null);
  const isDisabled = isSubmitting || isCoolingDown;

  async function handleSubmit() {
    if (isDisabled) return;
    setAuthError(null);

    const parsed = signUpSchema.safeParse({ fullName, email, phone, password, confirm });
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    const result = await signUp({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password: parsed.data.password,
    });
    setIsSubmitting(false);

    if (result.error) {
      setAuthError(result.error);
      startCooldown();
      return;
    }
    if (result.needsConfirmation) {
      onConfirmationSent(parsed.data.email);
    }
  }

  return (
    <View className="flex-grow justify-between">
      <View className="gap-7">
        <UnderlineField
          label="Full name"
          icon="person-outline"
          value={fullName}
          onChangeText={setFullName}
          error={fieldErrors.fullName}
          placeholder="Ada Lovelace"
          autoComplete="name"
          autoCapitalize="words"
          textContentType="name"
          maxLength={FULL_NAME_MAX_LENGTH}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <UnderlineField
          ref={emailRef}
          label="Email"
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
          placeholder="demo@email.com"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          textContentType="emailAddress"
          maxLength={EMAIL_MAX_LENGTH}
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />
        <UnderlineField
          ref={phoneRef}
          label="Phone"
          icon="phone"
          value={phone}
          onChangeText={setPhone}
          error={fieldErrors.phone}
          placeholder="0803 123 4567"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          maxLength={PHONE_MAX_LENGTH}
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
          error={fieldErrors.password}
          placeholder="**********"
          autoComplete="new-password"
          autoCapitalize="none"
          maxLength={PASSWORD_MAX_LENGTH}
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
        />
        <UnderlineField
          ref={confirmRef}
          label="Confirm Password"
          icon="lock-outline"
          password
          value={confirm}
          onChangeText={setConfirm}
          error={fieldErrors.confirm}
          placeholder="**********"
          autoComplete="new-password"
          autoCapitalize="none"
          maxLength={PASSWORD_MAX_LENGTH}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {authError ? (
          <View className="flex-row items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5">
            <MaterialIcons name="error-outline" size={18} color={colors.error} />
            <Text className="flex-1 text-sm font-jakarta-medium text-red-700">{authError}</Text>
          </View>
        ) : null}
      </View>

      <View className="gap-4 pt-8">
        <Pressable
          onPress={handleSubmit}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDisabled }}
          className={`h-[52px] items-center justify-center rounded-[10px] bg-brand-600 ${
            isDisabled ? "opacity-80" : "active:opacity-90"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-jakarta-semibold text-white">
              {isCoolingDown ? `Try again in ${secondsLeft}s` : "Sign up"}
            </Text>
          )}
        </Pressable>

        <View className="flex-row justify-center gap-1.5">
          <Text className="font-jakarta text-base text-neutral-500">Already have an Account!</Text>
          <Link replace href="/sign-in" className="font-jakarta-semibold text-base text-brand-600">
            Sign in
          </Link>
        </View>
      </View>
    </View>
  );
}
