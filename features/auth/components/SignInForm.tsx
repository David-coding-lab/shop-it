import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import type { ComponentRef } from "react";

import UnderlineField, { colors } from "@/components/ui/UnderlineField";
import { useAuth } from "@/features/auth/use-auth";
import { isValidEmail } from "@/lib/validation";

export function SignInForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  async function handleSubmit() {
    if (isSubmitting) return;
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
          disabled={isSubmitting}
          accessibilityRole="button"
          className={`h-[52px] items-center justify-center rounded-[10px] bg-primary ${
            isSubmitting ? "opacity-80" : "active:opacity-90"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-rubik-medium text-[19px] text-white">Sign in</Text>
          )}
        </Pressable>

        <View className="flex-row justify-center gap-1.5">
          <Text className="font-rubik text-base text-neutral-500">Don’t have an Account ?</Text>
          <Link href="/sign-up" className="font-rubik-medium text-base text-primary">
            Sign up
          </Link>
        </View>
      </View>
    </View>
  );
}