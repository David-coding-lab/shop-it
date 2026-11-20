import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "@/components/layout/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/features/auth/use-auth";
import { useProfile } from "@/features/profile/use-profile";

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const displayName = profile?.full_name?.trim() || user?.email?.split("@")[0] || "there";

  return (
    <Screen className="px-6">
      <View className="flex-1 justify-center gap-8">
        <View className="items-center gap-3">
          <Avatar name={profile?.full_name} email={user?.email} size={88} />
          <Text className="text-center text-2xl font-jakarta-bold text-neutral-900 dark:text-neutral-50">
            Hi, {displayName}
          </Text>
          <Text className="text-center text-neutral-500 dark:text-neutral-400">
            {user?.email}
          </Text>
        </View>

        <Card className="gap-4">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-600">
            <Ionicons name="storefront" size={24} color="#ffffff" />
          </View>
          <Text className="text-base font-jakarta-bold text-neutral-900 dark:text-neutral-50">
            Welcome to Shop-it
          </Text>
          <Text className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
            Soon you&apos;ll be able to find trusted cleaners, tutors, electricians and more near
            you, book them in minutes, pay securely, and only release payment when the job is done.
          </Text>
        </Card>

        <View className="gap-3">
          <Button title="Edit profile" onPress={() => router.push("/profile")} />
          <Button title="Sign out" variant="outline" onPress={() => void signOut()} />
        </View>
      </View>
    </Screen>
  );
}
