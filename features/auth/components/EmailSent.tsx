import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import EmailIllustration from "@/components/EmailIllustration";

export function EmailSent({ email }: { email: string }) {
  const router = useRouter();

  return (
    <View className="items-center gap-3.5 pt-2">
      <EmailIllustration width={220} />
      <Text className="mt-2 text-center font-rubik-bold text-[26px] text-ink">Check your email</Text>
      <Text className="max-w-[300px] text-center font-rubik text-[15px] leading-[22px] text-muted">
        We sent a confirmation link to <Text className="font-rubik-medium text-ink">{email}</Text>. Confirm it, then
        sign in.
      </Text>
      <Pressable
        onPress={() => router.replace("/sign-in")}
        accessibilityRole="button"
        className="mt-2.5 h-[52px] min-w-[180px] items-center justify-center rounded-[10px] bg-primary px-6 active:opacity-90"
      >
        <Text className="font-rubik-medium text-lg text-white">Continue</Text>
      </Pressable>
    </View>
  );
}
