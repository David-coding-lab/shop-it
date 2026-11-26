import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import UnderlineField, { colors } from "@/components/ui/UnderlineField";
import { EMAIL_MAX_LENGTH, emailSchema, firstErrorMessage } from "@/lib/validation";

type Props = {
  /** Sends the reset email. Return `{ error }` to show a message under the form. */
  onSendCode: (email: string) => Promise<{ error?: string | null }>;
  /** Called after the reset email was sent. */
  onSent: (email: string) => void;
};

export function ForgotPasswordForm({ onSendCode, onSent }: Props) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (isSubmitting) return;
    setAuthError(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setEmailError(firstErrorMessage(parsed.error));
      return;
    }

    setEmailError(null);
    setIsSubmitting(true);
    const { error } = await onSendCode(parsed.data);
    setIsSubmitting(false);

    if (error) {
      setAuthError(error);
      return;
    }
    onSent(parsed.data);
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
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
        />

        {authError ? (
          <View className="flex-row items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5">
            <MaterialIcons name="error-outline" size={18} color={colors.error} />
            <Text className="flex-1 font-rubik-medium text-sm text-red-700">{authError}</Text>
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        accessibilityRole="button"
        className={`mt-8 h-[52px] items-center justify-center rounded-[10px] bg-primary ${
          isSubmitting ? "opacity-80" : "active:opacity-90"
        }`}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-rubik-medium text-[19px] text-white">Send Code</Text>
        )}
      </Pressable>
    </View>
  );
}
