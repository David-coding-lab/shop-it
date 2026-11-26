import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import EmailIllustration from "@/components/EmailIllustration";
import { useAuth } from "@/features/auth/use-auth";

export type EmailSentMode = "signup" | "reset";

type Props = {
  email: string;
  mode?: EmailSentMode;
  messagePrefix?: string;
  messageSuffix?: string;
  illustrationWidth?: number;
};

const RESEND_SECONDS = 60;

const formatTime = (total: number) => {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export function EmailSent({
  email,
  mode = "signup",
  messagePrefix,
  messageSuffix,
  illustrationWidth = 264,
}: Props) {
  const { resetPassword, resendConfirmation } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const canResend = secondsLeft === 0 && !isSending;

  const handleResend = useCallback(async () => {
    if (!canResend) return;
    setError(null);
    setIsSending(true);

    const result =
      mode === "reset" ? await resetPassword(email) : await resendConfirmation(email);
    setIsSending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setSecondsLeft(RESEND_SECONDS);
  }, [canResend, email, mode, resetPassword, resendConfirmation]);

  const prefix = messagePrefix ?? "We’ve sent a verification link to ";
  const suffix =
    messageSuffix ?? ". Click the link to verify your email and continue to the app.";

  return (
    <View className="flex-1 justify-between">
      <View className="items-center">
        <EmailIllustration width={illustrationWidth} />
        <Text className="mt-[78px] mr-6 text-center font-rubik-bold text-[40px] leading-[48px] text-ink">
          Check your email
        </Text>
        <Text className="mt-3 max-w-[300px] text-center font-rubik text-[14.5px] leading-5 text-muted">
          {prefix}
          <Text className="font-rubik-medium text-ink">{email}</Text>
          {suffix}
        </Text>
      </View>

      <View className="gap-3.5">
        {error ? <Text className="font-rubik text-[13px] text-red-600">{error}</Text> : null}

        <Text className="font-rubik-medium text-[15px] text-neutral-500">
          Didn’t receive the email?{" "}
          <Text className="text-primary">
            {secondsLeft > 0 ? formatTime(secondsLeft) : "You can resend now"}
          </Text>
        </Text>

        <Pressable
          onPress={handleResend}
          disabled={!canResend}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canResend }}
          className={`h-[52px] items-center justify-center rounded-[10px] bg-primary ${
            canResend ? "active:opacity-90" : "opacity-55"
          }`}
        >
          {isSending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-rubik-medium text-[19px] text-white">Send Code</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
