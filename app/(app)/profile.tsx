import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { useProfile } from "@/features/profile/use-profile";

export default function ProfileScreen() {
  const router = useRouter();
  const profileState = useProfile();

  return (
    <Screen>
      <View className="flex-row items-center gap-2 px-4 pb-2 pt-2">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100 dark:active:bg-neutral-800"
        >
          <Ionicons name="chevron-back" size={24} color="#737373" />
        </Pressable>
        <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Profile
        </Text>
      </View>

      <ScrollView
        contentContainerClassName="gap-6 px-6 pb-10 pt-2"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader profileState={profileState} />
        <ProfileForm profileState={profileState} />
      </ScrollView>
    </Screen>
  );
}
