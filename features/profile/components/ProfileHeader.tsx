import { Text, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/features/auth/use-auth";
import type { ProfileState } from "@/features/profile/profile-state";

export function ProfileHeader({ profileState }: { profileState: ProfileState }) {
  const { user } = useAuth();
  const { profile } = profileState;

  return (
    <Card className="flex-row items-center gap-4">
      <Avatar name={profile?.full_name} email={user?.email} size={72} />
      <View className="flex-1 gap-0.5">
        <Text
          className="text-xl font-bold text-neutral-900 dark:text-neutral-50"
          numberOfLines={1}
        >
          {profile?.full_name?.trim() || "Your profile"}
        </Text>
        <Text
          className="text-sm text-neutral-500 dark:text-neutral-400"
          numberOfLines={1}
        >
          {user?.email}
        </Text>
      </View>
    </Card>
  );
}
