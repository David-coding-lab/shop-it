import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import type { ComponentRef } from "react";

import UnderlineField, { colors } from "@/components/ui/UnderlineField";
import { useAuth } from "@/features/auth/use-auth";
import { isValidEmail, validatePassword } from "@/lib/validation";

type Props = {
  onConfirmationSent: (email: string) => void;
};

const isValidPhone = (value: string) => /^\+?[0-9\s\-()]{7,18}$/.test(value.trim());

export function SignUpForm({ onConfirmationSent }: Props) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phoneRef = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const confirmRef = useRef<ComponentRef<typeof TextInput>>(null);

  async function handleSubmit() {
    if (isSubmitting) return;
    setAuthError(null);

    const trimmedEmail = email.trim();
    const errors = {
      email: isValidEmail(trimmedEmail) ? null : "Enter a valid email address.",
      phone: isValidPhone(phone) ? null : "Enter a valid phone number.",
      password: validatePassword(password),
      confirm: confirm === password ? null : "Passwords do not match.",
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setIsSubmitting(true);
    const result = await signUp(trimmedEmail, password, phone.trim());
    setIsSubmitting(false);

    if (result.error) {
      setAuthError(result.error);
      return;
    }
    if (result.needsConfirmation) {
      onConfirmationSent(trimmedEmail);
    }
  }

  return (
    <View className="flex-grow justify-between">
      <View className="gap-7">
        <UnderlineField
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
          placeholder="+91-0123456789"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
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
          disabled={isSubmitting}
          accessibilityRole="button"
          className={`h-[52px] items-center justify-center rounded-[10px] bg-brand-600 ${
            isSubmitting ? "opacity-80" : "active:opacity-90"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-jakarta-semibold text-white">Sign up</Text>
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
